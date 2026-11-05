import fs from 'fs';
import * as topo from 'topojson-client';
import * as simp from 'topojson-simplify';
import { geoAlbersUsa, geoPath } from 'd3-geo';
let us = JSON.parse(fs.readFileSync('node_modules/us-atlas/states-10m.json'));
us = simp.presimplify(us); us = simp.simplify(us, 0.02);
const drop = new Set(['02','15','72','78','60','66','69']);
const geoms = us.objects.states.geometries.filter(g=>!drop.has(g.id));
const obj = {type:'GeometryCollection', geometries: geoms};
const land = topo.merge(us, geoms);
const borders = topo.mesh(us, obj, (a,b)=>a!==b);
const proj = geoAlbersUsa().fitExtent([[10,10],[950,590]], land);
const path = geoPath(proj).digits(1);
const C = [
['SEA','Seattle','WA',47.61,-122.33,1],['SPK','Spokane','WA',47.66,-117.43,0],['PDX','Portland','OR',45.52,-122.68,1],
['MED','Medford','OR',42.33,-122.87,0],['RDG','Redding','CA',40.59,-122.39,0],['SAC','Sacramento','CA',38.58,-121.49,1],
['SFO','San Francisco','CA',37.77,-122.42,1],['FRE','Fresno','CA',36.74,-119.79,0],['LAX','Los Angeles','CA',34.05,-118.24,1],
['SAN','San Diego','CA',32.72,-117.16,1],['BAR','Barstow','CA',34.90,-117.02,0],['LAS','Las Vegas','NV',36.17,-115.14,1],
['RNO','Reno','NV',39.53,-119.81,0],['WIN','Winnemucca','NV',40.97,-117.74,0],['ELK','Elko','NV',40.83,-115.76,0],
['SLC','Salt Lake City','UT',40.76,-111.89,1],['CDC','Cedar City','UT',37.68,-113.06,0],['BOI','Boise','ID',43.62,-116.20,0],
['MSO','Missoula','MT',46.87,-113.99,0],['BZN','Bozeman','MT',45.68,-111.04,0],['BIL','Billings','MT',45.78,-108.50,0],
['PHX','Phoenix','AZ',33.45,-112.07,1],['TUS','Tucson','AZ',32.22,-110.97,0],['FLG','Flagstaff','AZ',35.20,-111.65,0],
['ABQ','Albuquerque','NM',35.08,-106.65,0],['ELP','El Paso','TX',31.76,-106.49,0],['FST','Fort Stockton','TX',30.89,-102.88,0],
['CHY','Cheyenne','WY',41.14,-104.82,0],['RKS','Rock Springs','WY',41.59,-109.20,0],['DEN','Denver','CO',39.74,-104.99,1],
['GJT','Grand Junction','CO',39.06,-108.55,0],['RAP','Rapid City','SD',44.08,-103.23,0],['SFD','Sioux Falls','SD',43.55,-96.73,0],
['FAR','Fargo','ND',46.88,-96.79,0],['BIS','Bismarck','ND',46.81,-100.78,0],['MSP','Minneapolis','MN',44.98,-93.27,1],
['OMA','Omaha','NE',41.26,-95.93,0],['NPL','North Platte','NE',41.12,-100.77,0],['MKC','Kansas City','MO',39.10,-94.58,1],
['SAL','Salina','KS',38.84,-97.61,0],['OKC','Oklahoma City','OK',35.47,-97.52,0],['TUL','Tulsa','OK',36.15,-95.99,0],
['AMA','Amarillo','TX',35.22,-101.83,0],['DFW','Dallas','TX',32.78,-96.80,1],['SAT','San Antonio','TX',29.42,-98.49,1],
['HOU','Houston','TX',29.76,-95.37,1],['AUS','Austin','TX',30.27,-97.74,1],['MAF','Midland','TX',31.99,-102.08,0],
['SHV','Shreveport','LA',32.51,-93.75,0],['LIT','Little Rock','AR',34.75,-92.29,0],['MEM','Memphis','TN',35.15,-90.05,0],
['JAN','Jackson','MS',32.30,-90.18,0],['MSY','New Orleans','LA',29.95,-90.07,1],['MOB','Mobile','AL',30.69,-88.04,0],
['BHM','Birmingham','AL',33.52,-86.80,0],['ATL','Atlanta','GA',33.75,-84.39,1],['BNA','Nashville','TN',36.16,-86.78,1],
['CHA','Chattanooga','TN',35.05,-85.31,0],['KNX','Knoxville','TN',35.96,-83.92,0],['STL','St. Louis','MO',38.63,-90.20,1],
['SGF','Springfield','MO',37.21,-93.29,0],['DSM','Des Moines','IA',41.59,-93.62,0],['CHI','Chicago','IL',41.88,-87.63,1],
['MAD','Madison','WI',43.07,-89.40,0],['IND','Indianapolis','IN',39.77,-86.16,1],['SDF','Louisville','KY',38.25,-85.76,0],
['LEX','Lexington','KY',38.04,-84.50,0],['CIN','Cincinnati','OH',39.10,-84.51,1],['CLE','Cleveland','OH',41.50,-81.69,1],
['CMH','Columbus','OH',39.96,-83.00,1],['DET','Detroit','MI',42.33,-83.05,1],['PIT','Pittsburgh','PA',40.44,-79.99,1],
['CRW','Charleston','WV',38.35,-81.63,0],['BUF','Buffalo','NY',42.89,-78.88,0],['ALB','Albany','NY',42.65,-73.76,0],
['BOS','Boston','MA',42.36,-71.06,1],['NYC','New York','NY',40.71,-74.01,1],['PHL','Philadelphia','PA',39.95,-75.17,1],
['HAR','Harrisburg','PA',40.27,-76.88,0],['DCA','Washington','DC',38.91,-77.04,1],['RIC','Richmond','VA',37.54,-77.44,0],
['ROA','Roanoke','VA',37.27,-79.94,0],['CLT','Charlotte','NC',35.23,-80.84,1],['RDU','Raleigh','NC',35.78,-78.64,1],
['AVL','Asheville','NC',35.60,-82.55,0],['CAE','Columbia','SC',34.00,-81.03,0],['SAV','Savannah','GA',32.08,-81.09,0],
['JAX','Jacksonville','FL',30.33,-81.66,0],['TLH','Tallahassee','FL',30.44,-84.28,0],['VLD','Valdosta','GA',30.83,-83.28,0],
['ORL','Orlando','FL',28.54,-81.38,1],['TPA','Tampa','FL',27.95,-82.46,1],['MIA','Miami','FL',25.76,-80.19,1],
['CBY','Colby','KS',39.40,-101.05,0],['HYS','Hays','KS',38.88,-99.33,0],['MLS','Miles City','MT',46.41,-105.84,0],['DIK','Dickinson','ND',46.88,-102.79,0],
['LMR','Lamar','CO',38.09,-102.62,0],['BLH','Blythe','CA',33.61,-114.60,0],['PDT','Pendleton','OR',45.67,-118.79,0],['IDA','Idaho Falls','ID',43.49,-112.03,0],
['BTM','Butte','MT',46.00,-112.53,0],['SAF','Santa Fe','NM',35.69,-105.94,0],['TAD','Trinidad','CO',37.17,-104.51,0],['CHB','Chamberlain','SD',43.81,-99.33,0],
['LCH','Lake Charles','LA',30.23,-93.22,0],['BTR','Baton Rouge','LA',30.45,-91.15,0],['ABI','Abilene','TX',32.45,-99.73,0],['QCY','Davenport','IA',41.52,-90.58,0],
['TOL','Toledo','OH',41.65,-83.54,0],['IGM','Kingman','AZ',35.19,-114.05,0],['FSM','Fort Smith','AR',35.39,-94.40,0],['YUM','Yuma','AZ',32.69,-114.63,0],
['ICT','Wichita','KS',37.69,-97.34,0],['TWF','Twin Falls','ID',42.56,-114.46,0],['TXK','Texarkana','TX',33.43,-94.05,0],['FLO','Florence','SC',34.20,-79.76,0],
['SHR','Sheridan','WY',44.80,-106.96,0],['GUP','Gallup','NM',35.53,-108.74,0],['JCT','Junction','TX',30.49,-99.77,0],['TCC','Tucumcari','NM',35.17,-103.72,0],
['SPI','Springfield','IL',39.78,-89.65,0],['SYR','Syracuse','NY',43.05,-76.15,0],['MVN','Mount Vernon','IL',38.32,-88.90,0],['EAR','Kearney','NE',40.70,-99.08,0],
['COU','Columbia','MO',38.95,-92.33,0],
];
const E = `I-5:SEA-PDX,PDX-MED,MED-RDG,RDG-SAC,FRE-LAX,LAX-SAN|CA-99:SAC-FRE|I-580:SFO-FRE|I-80:SFO-SAC,SAC-RNO,RNO-WIN,WIN-ELK,ELK-SLC,SLC-RKS,RKS-CHY,CHY-NPL,NPL-EAR,EAR-OMA,OMA-DSM,DSM-QCY,QCY-CHI,CHI-TOL,TOL-CLE|I-90:SEA-SPK,SPK-MSO,MSO-BTM,BTM-BZN,BZN-BIL,BIL-SHR,SHR-RAP,RAP-CHB,CHB-SFD,MAD-CHI,CLE-BUF,BUF-SYR,SYR-ALB,ALB-BOS|I-94:BIL-MLS,MLS-DIK,DIK-BIS,BIS-FAR,FAR-MSP,MSP-MAD,DET-CHI|US-169:SFD-MSP|I-84:PDX-PDT,PDT-BOI,BOI-TWF,TWF-SLC|I-76:CLE-PIT,PIT-HAR,HAR-PHL,DEN-NPL|I-95:PHL-NYC,NYC-BOS,JAX-SAV,SAV-FLO,FLO-RDU,RDU-RIC,RIC-DCA,DCA-PHL,ORL-MIA|I-87:ALB-NYC|I-15:LAX-BAR,SAN-BAR,BAR-LAS,LAS-CDC,CDC-SLC,SLC-IDA,IDA-BTM|I-40:BAR-IGM,IGM-FLG,FLG-GUP,GUP-ABQ,ABQ-TCC,TCC-AMA,AMA-OKC,OKC-FSM,FSM-LIT,LIT-MEM,MEM-BNA,BNA-KNX,KNX-AVL,AVL-RDU|I-10:LAX-BLH,BLH-PHX,PHX-TUS,TUS-ELP,ELP-FST,FST-JCT,JCT-SAT,SAT-HOU,HOU-LCH,LCH-BTR,BTR-MSY,MSY-MOB,MOB-TLH,TLH-JAX,TLH-VLD|I-8:SAN-YUM,YUM-PHX|I-17:PHX-FLG|I-25:ELP-ABQ,ABQ-SAF,SAF-TAD,TAD-DEN,DEN-CHY|I-70:SLC-GJT,GJT-DEN,DEN-CBY,CBY-HYS,HYS-SAL,SAL-MKC,MKC-COU,COU-STL,STL-IND,IND-CMH,CMH-PIT|I-35:SAT-AUS,AUS-DFW,DFW-OKC,OKC-ICT,ICT-MKC,MKC-DSM,DSM-MSP|I-20:MAF-ABI,ABI-DFW,MAF-ELP,DFW-SHV,SHV-JAN,JAN-BHM,BHM-ATL,ATL-CAE|I-55:MSY-JAN,JAN-MEM,MEM-STL,STL-SPI,SPI-CHI|I-65:MOB-BHM,BHM-BNA,BNA-SDF,SDF-IND,IND-CHI|I-75:TPA-VLD,VLD-ATL,ATL-CHA,CHA-KNX,KNX-LEX,LEX-CIN,CIN-TOL,TOL-DET|I-24:CHA-BNA,BNA-MVN,MVN-STL|I-59:CHA-BHM|I-64:MVN-SDF,SDF-LEX,LEX-CRW,CRW-RIC|I-79:CRW-PIT|US-35:CRW-CMH|I-71:CIN-CMH,CMH-CLE|I-74:CIN-IND|I-4:ORL-TPA,JAX-ORL|I-81:KNX-ROA,ROA-HAR,HAR-ALB|US-460:ROA-RIC|I-77:ROA-CLT,CLT-CAE|I-85:CLT-RDU,CLT-ATL|I-26:AVL-CAE|I-16:SAV-ATL|I-44:STL-SGF,SGF-TUL,TUL-OKC|I-30:DFW-TXK,TXK-LIT|I-45:HOU-DFW|I-29:MKC-OMA,OMA-SFD,SFD-FAR|US-287:AMA-LMR,LMR-DEN|US-93:LAS-IGM,IGM-PHX|US-85:RAP-CHY|I-135:ICT-SAL|I-20:CAE-FLO`;
const byId = Object.fromEntries(C.map(c=>[c[0],c]));
const hav=(a,b)=>{const R=3958.8,t=x=>x*Math.PI/180;const dl=t(b[3]-a[3]),dn=t(b[4]-a[4]);const h=Math.sin(dl/2)**2+Math.cos(t(a[3]))*Math.cos(t(b[3]))*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h));};
const edges=[];
for(const grp of E.split('|')){const [lab,list]=grp.split(':');for(const p of list.split(',')){const [a,b]=p.split('-');if(!byId[a]||!byId[b])throw new Error(p);edges.push([a,b,lab,Math.round(hav(byId[a],byId[b])*1.17)]);}}
const cities=C.map(([id,n,st,lat,lon,m])=>{const [x,y]=proj([lon,lat]);return {id,n,st,lat,lon,m,x:+x.toFixed(1),y:+y.toFixed(1)};});
const data={land:path(land),borders:path(borders),cities,edges};
fs.writeFileSync('data.json',JSON.stringify(data));
console.log('bytes',JSON.stringify(data).length,'edges',edges.length,'max',Math.max(...edges.map(e=>e[3])));
