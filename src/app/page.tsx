'use client';

import generateColorPalette from "@/actions/submit";
import { ChangeEvent, useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

export default function Home() {  
  const [inputVal, setInputVal] = useState('');
  const [colorPaletteResponse, generateColorPaletteAction] = useActionState(generateColorPalette, null);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };
  
  return (
    <>
      <div className="fixed w-full h-full flex portrait:flex-col">
        {colorPaletteResponse && colorPaletteResponse.colors.map(hex => <ColorBar key={`${hex}_${colorPaletteResponse.uuid}`} hex={hex} />)}
      </div>
      <div className="flex h-full justify-center items-center relative pointer-events-none">
        <form action={generateColorPaletteAction} className={`pointer-events-auto w-full max-w-[400px] mx-9 box-content p-8 rounded-md ${colorPaletteResponse && 'bg-white/60'}`}>
          <label className="block pb-2 font-bold leading-5" htmlFor="prompt">Enter a description of a color palette</label>
          <input value={inputVal} onChange={onInputChange} type="text" name="prompt" id="prompt" className="py-2 px-4 w-full rounded-md ring-1 ring-black focus-visible:ring-blue-700 focus-visible:-ring-offset-1 focus-visible:ring-2" />
          <Loading />
        </form>
      </div>
    </>
  );
}

function Loading() {
  const { pending } = useFormStatus();
  return <p className={`pt-2 after:inline-block after:animate-ellipsis ${pending ? 'visible' : 'invisible'}`}>Thinking</p>;
}

function ColorBar({hex}: {hex: string}) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [showCopied, setShowCopied] = useState(false);

  const copyColor = () => {
    navigator.clipboard.writeText(hex);
    setShowCopied(true);

    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowCopied(false);
    }, 1000)
  };

  return (
    <div className="relative grow cursor-pointer group" style={{backgroundColor: hex}} onClick={copyColor}>
      <span className="hidden absolute bg-white/80 rounded-md px-3 font-bold top-3 left-1/2 -translate-x-1/2 group-hover:block portrait:left-3 portrait:translate-x-0">
        {showCopied ? '✅ Copied!' : hex}
      </span>
    </div>
  );
}