import React, { useState, useEffect } from "react";

interface Description {
  title: string;
  description: string;
}

interface Props {
  description: Description;
}

const TextArea: React.FC<Props> = ({ description }) => {
  const [decodedDescription, setDecodedDescription] = useState<string>('');

  useEffect(() => {
    if (description && description.description) {
      const decoder = new TextDecoder('utf-8');
      const text = decoder.decode(new Uint8Array(description.description.split('').map(char => char.charCodeAt(0))));
      setDecodedDescription(text);
    }
  }, [description]);

  return (
    <div className="bg-[#1D2228] h-[90%] m-auto mobile:m-2">
      <div className="bg-[#30363D] h-[15%] flex">
        <p className='text-[#c1c1c4] p-4 flex items-center font-[cursive] select-none'>
          {description.title}
        </p>
      </div>

      <div className='flex w-[90%] h-[80%] m-4 cursor-text mobile:h-10'>
         <p className='text-[#c1c1c4] text-[14pt] font-[cursive] select-none' style={{ maxWidth: '100%', textOverflow: 'ellipsis' }}>
          {decodedDescription}
        </p>
      </div>
    </div>
  );
}

export default TextArea;
