"use client";
// Essentials
import { useState, useEffect } from 'react';
import Image from 'next/image';

// External Libraries
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark }   from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Autoplay          from 'embla-carousel-autoplay';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
}                            from "@/components/ui/carousel"
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton }          from '@/components/ui/skeleton';

import { Octokit } from 'octokit';
//
// Components
import Database from '@/app/Components/Database';
import Flatlist from '@/app/Components/FlatList';
import TextArea from '@/app/Components/TextArea';
import Tabela   from '@/app/Components/Table';
import GitTable from '@/app/Components/gitTable';
//
// Assets
import baner from '@/../public/baner.png';
//

interface Databases {
  description: string
  html_url: string | undefined;
  id: number;
  name: string;
  sql: string;
  tables: {
    id: number;
    name: string;
    columns: {
      id: number;
      title: string;
      description: string
    }[]
  }[];
}

interface Technologies {
  name:         string;
  url?:         string;
}

export default function Home() {

  const [currentDatabase, setCurrentDatabase] = useState<Databases | undefined>(undefined);

  const [selectedDatabaseId, setSelectedDatabaseId] = useState<number>(1);

  const [databases, setDatabases] = useState<Databases[]>([]);

  const [projects, setProjects] = useState<Databases[]>([]);

  const [technologies, setTechnologies] = useState<Technologies[]>([]);

  const allTechnologies: Technologies[] = [{name:'NestJs'}, {name:'TailwindCss'}, {name:'NextJs'}];

  const octokit = new Octokit({ 
    auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN
  });

  useEffect(() => {

    async function fetchData() {
      
      try {
        const gitApiResponse_databases = await octokit.request('GET /repos/herick-develop/portfolio/contents/databases/databases.json?ref=main');
        const gitApiResponse_projects  = await octokit.request('GET /users/herick-develop/repos');
        const technologyIconSearched   = await octokit.request('GET /repos/herick-develop/portfolio/contents/tecnologies_icons?ref=main');
  
        const databasesContent       = JSON.parse(atob(gitApiResponse_databases.data.content));
        const projectsContent        = gitApiResponse_projects.data;
        const technologyIconsContent = technologyIconSearched.data;
  
        setDatabases(databasesContent);
        setProjects(projectsContent);
  
        for (const project of projectsContent) {

          const technologiesSearched = await octokit.request(`GET /repos/herick-develop/${project.name}/languages`);
  
          Object.keys(technologiesSearched.data).forEach((technology) => {

            if (!allTechnologies.some((tech) => tech.name === technology)) {

              allTechnologies.push({ name: technology });
            }

          });
        };
  
        const updatedTechnologies = allTechnologies.map((tech) => {

          const icon = technologyIconsContent.find((icon:Technologies) =>

            icon.name.replace('.svg', '').toLocaleLowerCase() === tech.name.toLocaleLowerCase()
          );
  
          if (icon) {

            return { ...tech, url: icon.url};
          };

          return tech;
        });

        setTechnologies(updatedTechnologies);
  
      } catch (error) {
      } finally {};
    };
  
    fetchData();
  }, []);
  

  function ChangeSelectedDatabaseId(newSelectedDatabaseId: number) {

    setSelectedDatabaseId( newSelectedDatabaseId );
    
    setCurrentDatabase( ( databases.find ( database => database.id === selectedDatabaseId ) ) );

  }

  return (
    <main className="flex h-screen flex-col bg-[#0D1117]">

      <div className="flex h-screen flex-col items-center justify-between bg-[#0D1117] border-[1px] border-[#c1c1c4] m-8 mobile:m-4">

        <div className="w-full flex">

          {baner ? (
              <Image priority={true} src={baner} alt='baner' className='w-[32%] m-6 mb-0 select-none mobile:w-[80vw]' draggable={false}/>
            ) : (
              <Skeleton className="w-[32%] h-24 m-6 mb-0 select-none mobile:w-[80vw] bg-[#363636]" />
            )
          }

        </div>

        <div className="w-full">

          <div className="w-fit h-fit grid grid-cols-2 ml-6 mt-6 mb-4">

            {databases.map((database: Databases) => {

              return (
                <Database
                  key={database.id}
                  database={database}
                  ChangeSelectedDatabaseId={ChangeSelectedDatabaseId}
                  selectedDatabaseId={selectedDatabaseId}
                />
              );
            })}

          </div>

        </div>

        <div className="w-full h-full flex mobile:w-[90%] mobile:h-fit">
          <div className="w-9/12 h-full m-4 mobile:w-full mobile:h-fit mobile:m-auto">

          { ( () => {
            const sql = databases.find(database => database.id === selectedDatabaseId)?.sql ?? '' as string;

            if(sql) {return (
              <SyntaxHighlighter
                  className="h-[90%] text-[14pt] font-semibold mobile:text-[8pt] mobile:h-[64%]"
                  language="sql"
                  style={atomOneDark}
                  customStyle={{padding: '24px', userSelect: 'none', cursor: 'text', backgroundColor: '#363636'}}
                  wrapLongLines={true}
                  showLineNumbers={true}
                  showInlineLineNumbers={true}
                >
                  { sql }
                </SyntaxHighlighter>
              )
            } else {
              return (<></>
                // <Skeleton className="h-[90%] text-[14pt] font-semibold mobile:text-[8pt] mobile:h-[64%] bg-[#363636]" />
              )
            }

          } )() }

          </div>

          <div className="w-9/12 h-full max-h-[20.5rem] m-4 mobile:w-full mobile:h-fit mobile:m-auto flex mobile:hidden">

            { (() => {

              if(selectedDatabaseId === 1 || selectedDatabaseId === 4) {
                return (
                  <div className='overflow-auto w-full' style={{scrollbarWidth: 'none', scrollbarColor: '#888 #c1c1c4'}}>
                    <Tabela tableData={databases.find(database => database.id === selectedDatabaseId)?.tables[0].columns ?? []} />
                  </div>
                )
              } else if (selectedDatabaseId === 2) {

                return(
                  <div className='overflow-auto w-full' style={{scrollbarWidth: 'none', scrollbarColor: '#888 #c1c1c4'}}>
                  <GitTable colrows={technologies}/>
                  </div>
                )
              } else if (selectedDatabaseId === 3) {
                const projectsProperties = projects.map(({ name, description }) => ({ name, description }));
                return(
                  <div className='overflow-auto w-full' style={{scrollbarWidth: 'none', scrollbarColor: '#888 #c1c1c4'}}>
                  <GitTable colrows={projectsProperties}/>
                  </div>
                )
              }

            })()}

          </div>

        </div>

        <div className="w-[98%] flex h-[-webkit-fill-available]">

        {(() => {
          const databaseName = databases.find(database => database.id === selectedDatabaseId)?.name;
          
          if (databaseName === 'about') {
            return(
              <TextArea description={databases[selectedDatabaseId-1].tables[0].columns[0]} />
            );
          } else if (databaseName === 'projects') {

            return (
              <Carousel className="w-full m-auto mobile:m-auto mobile:flex items-end mobile:h-fit"
                plugins={[
                  Autoplay({
                    delay: 3000,
                  }),
                ]}
              >
                <CarouselContent className="-ml-1 mobile:m-4">

                  { projects.map((project) => {

                    if( project.name !== 'herick-develop' && project.name !== 'portfolio') {

                      const projectName = project.name;
                      const imageSource = `https://api.github.com/repos/herick-develop/${project.name}/contents/${project.name}.png?ref=main`;

                      return (

                        <CarouselItem key={project.id} className="ml-1 p-0 max-w-64">
                          <div className="mr-6">
                            <Card className='border-0 cursor-pointer'>
                              <a href={project.html_url} target="_blank" rel="noopener noreferrer">
                              <CardContent className="p-0 flex aspect-square items-center justify-center">

                                <Flatlist titleUrl={projectName} imageUrl={imageSource}/>

                              </CardContent>
                              </a>
                            </Card>
                          </div>
                        </CarouselItem>
                      
                      );
                    }
                  } ) }

                </CarouselContent>
              </Carousel>
              
            );

          } else if (databaseName === 'tecnologies') {

            return (
              <Carousel className="w-full m-auto mobile:m-auto mobile:flex items-end mobile:h-fit"
                plugins={[
                  Autoplay({
                    delay: 3000,
                  }),
                ]}
              >
                <CarouselContent className="-ml-1 mobile:m-4">

                  { technologies.map((technology, index) => {

                    return (

                      <CarouselItem key={index} className="ml-1 p-0 max-w-64">
                        <div className="mr-6">
                          <Card className='border-0 cursor-pointer'>
                            <CardContent className="p-0 flex aspect-square items-center justify-center">

                              <Flatlist titleUrl={technology.name} imageUrl={technology.url} tecnologie={true} />

                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    
                    );
                  } ) }

                </CarouselContent>
              </Carousel>
              
            );

          } else if (databaseName === 'contacts') {
            const contacts = databases.find(database => database.id === 4);

            return (
              <Carousel className="w-full m-auto mobile:m-auto mobile:flex items-end mobile:h-fit"
                plugins={[
                  Autoplay({
                    delay: 3000,
                  }),
                ]}
              >
                <CarouselContent className="-ml-1 mobile:m-4">

                  { contacts?.tables[0].columns.map((contact:any, index) => {

                    const imageSource = `https://api.github.com/repos/herick-develop/portfolio/contents/contacts_icon/${contact.plataform.toLocaleLowerCase()}.svg?ref=main`;

                    return (

                      <CarouselItem key={index} className="ml-1 p-0 max-w-64">
                        <div className="mr-6">
                          <Card className='border-0 cursor-pointer'>
                            <a href={contact.link} target="_blank" rel="noopener noreferrer">
                            <CardContent className="p-0 flex aspect-square items-center justify-center">

                              <Flatlist titleUrl={contact.plataform} imageUrl={imageSource} tecnologie={true} />

                            </CardContent>
                            </a>
                          </Card>
                        </div>
                      </CarouselItem>
                    
                    );
                  } ) }

                </CarouselContent>
              </Carousel>
              
            );
          } else {
            return(
              <div></div>
            )
          }
        })()}

        </div>

    </div>
    </main>
  );
}
