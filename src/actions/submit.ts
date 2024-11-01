'use server';

import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { randomUUID } from "crypto";

const openai = new OpenAI();

// JSON Schema
const ColorsSchema = z.object({
  colors: z.array(z.string())
});

// Helper function to validate hex colors
const isValidHex = (color: string) => /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(color);

export default async function generateColorPalette(prevState: unknown, formData: FormData) {
	const prompt = formData.get('prompt') as string;

	const completion = await openai.chat.completions.create({
		model: 'gpt-4o-mini',
		response_format: zodResponseFormat(ColorsSchema, 'colors_response'),
		messages: [
			{
				role: 'system',
				content: 'You are an assistant that provides hexcode color palette suggestions based on user input. Please return an object with an array of 2-8 colors in hex format.',
			},
			{
				role: 'user',
				content: prompt
			},
		],
	});

	const { colors } = JSON.parse(completion.choices[0].message.content as string) as {colors: string[]};
  const validColors = colors.filter(isValidHex);

	return {
		colors: validColors,
		uuid: randomUUID()
	}
}
