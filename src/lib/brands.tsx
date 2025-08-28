import React from 'react'
export const BRAND_META: Record<string, {logo:string, color:string}> = {
  "Allbirds, Inc.": { logo: "/brand-logos/Allbirds,_Inc..svg", color: "#111827" },
  "Huel": { logo: "/brand-logos/Huel.svg", color: "#0f172a" },
  "B&H Photo Video": { logo: "/brand-logos/BHandH_Photo_Video.svg", color: "#7f1d1d" },
  "Gymshark": { logo: "/brand-logos/Gymshark.svg", color: "#0a0a0a" },
  "Glossier": { logo: "/brand-logos/Glossier.svg", color: "#111827" },
  "Blue Bottle Coffee": { logo: "/brand-logos/Blue_Bottle_Coffee.svg", color: "#0b3d91" }
}
export function BrandBadge({ name }: { name: string }){
  const meta = BRAND_META[name]
  const initials = name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase()
  if (meta) return <img src={meta.logo} alt={name} className="h-5 w-5 rounded-md inline-block mr-2 align-middle" />
  return <span className="h-5 w-5 inline-flex items-center justify-center rounded-md mr-2 align-middle" style={{background:'#1f2937',color:'#e5e7eb',fontSize:10,fontWeight:700}}>{initials}</span>
}
