import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Octokit } from 'octokit';

import { Skeleton } from '@/components/ui/skeleton';

interface FlatlistProps {
  titleUrl?: string;
  imageUrl?: string;
  tecnologie?: boolean;
}

const octokit = new Octokit({ 
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN
});

export default function Flatlist({ titleUrl, imageUrl, tecnologie = false }: FlatlistProps) {

  const [enter, setEnter] = useState(false)

  const [imageSource, setImageSource] = useState<string>('https://raw.githubusercontent.com/herick-develop/portfolio/main/tecnologies_icons/github.svg');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl) return

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await octokit.request('GET ' + imageUrl);
        setImageSource(res.data.download_url);
      } catch (error) {
        setImageSource('https://raw.githubusercontent.com/herick-develop/portfolio/main/tecnologies_icons/github.svg')
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [imageUrl]);

  return (

    <div className="h-full w-full rounded-lg bg-[#1d2228]" onMouseEnter={() => setEnter(true)} onMouseLeave={() => setEnter(false)} onTouchMove={() => setEnter(true)} onTouchEnd={() => setEnter(false)}>
      <div className={`bg-[#30363D] h-[15%] w-full rounded-t-lg flex items-center justify-center ${ enter ? 'shadow-[0px_32px_40px_#7b61ff]' : 'shadow-[0px_1px_0px_0px_#7b61ff]' } `}>
        <p className="text-[#c1c1c4] select-none">{titleUrl}</p>
      </div>
      <div className="flex items-center w-[90%] h-[85%] m-auto">
        {loading && 
          <div className="flex w-[74%] h-[74%] m-auto">
            <Skeleton className="h-full w-full rounded-xl bg-[#30363d]" />
          </div>
        }
        {error && <p className="text-[#ff4f4f] m-auto">{error}</p>}
        {!loading && !error && imageSource && (
        <Image 
          className="rounded-md select-none z-0"
          width={200} 
          height={200} 
          style={{ width: tecnologie ? '60%' : 'auto', height: 'inherit', margin: '0 auto' }}
          src={imageSource} 
          alt="banner" 
          draggable="false" 
        />
        
        )}
        
      </div>
    </div>
  );
}
