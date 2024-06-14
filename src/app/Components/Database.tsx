// "use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Image from 'next/image';
import database_icon from '@/../../public/database_icon.svg';

interface DatabaseProps{
  selectedDatabaseId: number,
  ChangeSelectedDatabaseId: Function,
	database: {id: number, name: string},
}

export default function Database(props: DatabaseProps) {

  return (

    <div id={JSON.stringify(props.database.id)} className='flex items-center m-2 w-fit cursor-pointer' onMouseOver={ (evt) => { props.ChangeSelectedDatabaseId(JSON.parse(evt.currentTarget.id)) }} >

      <Image src={ database_icon} alt='baner' className='w-[30px] select-none drop-shadow-[-4px_0px_.8px_#7b61ff]' style={{ filter: props.database.id == props.selectedDatabaseId ? 'drop-shadow(0px 0px 16px white)' : '' }} draggable='false'/>

      <p className="p-1.5 text-base text-[#c1c1c4] select-none" style={{ filter: props.database.id == props.selectedDatabaseId ? 'drop-shadow(0px 0px 12px white)' : '' }}>{props.database.name}</p>

    </div>

  );
}
