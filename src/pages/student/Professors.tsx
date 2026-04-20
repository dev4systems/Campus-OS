import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import { GraduationCap, Mail, CalendarDays, FlaskConical, ExternalLink, Search, Phone, Copy, SlidersHorizontal, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Professor {
  id: string; name: string; designation: string; designation_short: string;
  department?: string; email: string; phone: string; joined: number; initials: string; color: string;
  research: string[]; subjects: string[]; lab: string | null; profile_url: string;
}

const FALLBACK_PROFESSORS: Professor[] = [
  {"id":"p001","name":"Prof. Tanmay De","designation":"Professor & HOD","designation_short":"HOD","department":"CSE","email":"hod.cse@nitdgp.ac.in","phone":"+91-9434788123","joined":1998,"initials":"TD","color":"#1a3a5c","research":["Optical Networks","Delay Tolerant Networks","Wireless Sensor Networks"],"subjects":["Computer Networks","Advanced Networking"],"lab":null,"profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/hod-2"},
  {"id":"p002","name":"Dr. Asok Sarkar","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"CSE","email":"asarkar.cse@nitdgp.ac.in","phone":"+91-9434002205","joined":2000,"initials":"AS","color":"#2d6a4f","research":["Design & Analysis of Algorithms","Computational Theory","Graph Theory"],"subjects":["Design & Analysis of Algorithms","Theory of Computation"],"lab":null,"profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p003","name":"Dr. Atanu Dutta","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"CSE","email":"adutta.cse@nitdgp.ac.in","phone":"+91-9434788180","joined":2007,"initials":"AD","color":"#6a0572","research":["Agentic AI","LLM Multi-agent Systems","Natural Language Processing"],"subjects":["Artificial Intelligence","Machine Learning"],"lab":"AI/ML Research Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p004","name":"Dr. Prasenjit Choudhury","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"CSE","email":"pchoudhury.cse@nitdgp.ac.in","phone":"+91-9434788196","joined":2001,"initials":"PC","color":"#b5451b","research":["Algorithmic Game Theory","Resource Allocation","Mechanism Design"],"subjects":["Discrete Mathematics","Algorithms"],"lab":null,"profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1/prasenjit-choudhury"},
  {"id":"p005","name":"Dr. Sujan Kumar Saha","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"CSE","email":"ssaha.cse@nitdgp.ac.in","phone":"","joined":2022,"initials":"SS","color":"#0d4f8b","research":["Natural Language Processing","Education Technology","Handwritten Character Recognition","Speech Recognition in Indian Languages"],"subjects":["Natural Language Processing","Information Retrieval"],"lab":"NLP Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1/sujan-kumar-saha"},
  {"id":"p006","name":"Dr. Biswapati Jana","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"CSE","email":"bchakraborty.cse@nitdgp.ac.in","phone":"+91-9434788065","joined":2001,"initials":"BJ","color":"#1b4332","research":["Hardware Security","Cognitive Computing","VLSI Design & Testing"],"subjects":["Computer Organisation & Architecture","VLSI Design"],"lab":"Hardware Security Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p007","name":"Dr. Binanda Sengupta","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"CSE","email":"bsen.cse@nitdgp.ac.in","phone":"+91-9434788161","joined":2008,"initials":"BS","color":"#3a0ca3","research":["Biometrics","Pattern Recognition","Image Processing"],"subjects":["Pattern Recognition","Digital Image Processing"],"lab":"Biometrics Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p008","name":"Dr. Dibyendu Nandi","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"CSE","email":"dnandi.cse@nitdgp.ac.in","phone":"+91-9434788026","joined":2001,"initials":"DN","color":"#457b9d","research":["Cellular Automata","VLSI Design & Testing","Cryptography"],"subjects":["Digital Electronics","Computer Architecture"],"lab":"VLSI Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p009","name":"Dr. Deepsubhra Guha Roy","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"CSE","email":"dmitra.cse@nitdgp.ac.in","phone":"+91-9434789012","joined":2010,"initials":"DG","color":"#e63946","research":["Distributed Algorithms","Swarm Robotics","Robot Deployment","IoT"],"subjects":["Distributed Systems","Operating Systems"],"lab":"Robotics & IoT Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p010","name":"Dr. Amitava Das","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"CSE","email":"ddas.cse@nitdgp.ac.in","phone":"+91-9434788179","joined":2007,"initials":"AD","color":"#f4a261","research":["Artificial Intelligence","Machine Learning","Sentiment Analysis"],"subjects":["Artificial Intelligence","Soft Computing"],"lab":"AI Research Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p011","name":"Dr. Goutam Saha (Sarker)","designation":"Professor","designation_short":"Professor","department":"CSE","email":"gsarker.cse@nitdgp.ac.in","phone":"+91-9434788025","joined":1998,"initials":"GS","color":"#2b2d42","research":["Cryptography","Multiparty Computation","Information Security"],"subjects":["Cryptography & Network Security","Information Security"],"lab":"Cryptography Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p012","name":"Dr. Jaya Sil (Howlader)","designation":"Professor","designation_short":"Professor","department":"CSE","email":"jhowlader.cse@nitdgp.ac.in","phone":"+91-9434788178","joined":2002,"initials":"JH","color":"#80b918","research":["Biomedical & Healthcare Systems","Multimedia","Machine Learning"],"subjects":["Multimedia Systems","Database Management Systems"],"lab":"Biomedical Computing Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p013","name":"Dr. Monidipa Das","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"CSE","email":"mdalui.cse@nitdgp.ac.in","phone":"+91-9434789011","joined":2010,"initials":"MD","color":"#9c6644","research":["Computational Biology","Bioinformatics","Machine Learning"],"subjects":["Bioinformatics","Data Mining"],"lab":"Computational Biology Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p014","name":"Dr. Mrinal Kanti Saha","designation":"Professor","designation_short":"Professor","department":"CSE","email":"msaha.cse@nitdgp.ac.in","phone":"+91-9434788194","joined":2000,"initials":"MS","color":"#264653","research":["Machine Learning","Deep Learning","Generative AI","Computer Vision"],"subjects":["Machine Learning","Deep Learning","Computer Vision"],"lab":"Deep Learning Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p015","name":"Dr. Narayan Chandra Jana","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"CSE","email":"ndjana.cse@nitdgp.ac.in","phone":"+91-9434788181","joined":2008,"initials":"NJ","color":"#e9c46a","research":["Formal Methods","Software Engineering","Automata Theory"],"subjects":["Formal Languages & Automata","Software Engineering"],"lab":null,"profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p016","name":"Dr. Narayan Murmu","designation":"Assistant Professor","designation_short":"Asst. Prof.","department":"CSE","email":"nmurmu.cse@nitdgp.ac.in","phone":"+91-9434788096","joined":2022,"initials":"NM","color":"#4cc9f0","research":["DBMS","Computer Networks","Algorithm Design & Analysis","Functional Programming"],"subjects":["Database Management Systems","Computer Networks"],"lab":"Networking Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p017","name":"Dr. Parag Kumar Guha Thakurta","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"CSE","email":"pkguhathakurta.cse@nitdgp.ac.in","phone":"+91-9434788159","joined":2007,"initials":"PG","color":"#7b2d8b","research":["Recommender Systems","Data Science","Social Network Analysis"],"subjects":["Data Science","Social Networks & Web Mining"],"lab":"Data Science Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p018","name":"Dr. Sumona Mukhopadhyay","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"CSE","email":"smukhopadhyay.cse@nitdgp.ac.in","phone":"+91-9434788177","joined":2001,"initials":"SM","color":"#d62828","research":["Cryptography","Network Security","Information Hiding"],"subjects":["Cryptography & Network Security","Computer Networks"],"lab":"Security Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p019","name":"Dr. Sandip Karmakar","designation":"Assistant Professor","designation_short":"Asst. Prof.","department":"CSE","email":"skarmakar.cse@nitdgp.ac.in","phone":"+91-9434789035","joined":2018,"initials":"SK","color":"#0077b6","research":["Wireless Ad Hoc & Sensor Networks","Quality of Service","IoT Security"],"subjects":["Wireless Networks","Internet of Things"],"lab":"Wireless & Sensor Networks Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p020","name":"Dr. Shrutilipi Bhattacharjee","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"CSE","email":"sbhattacharjee.cse@nitdgp.ac.in","phone":"+91-9434789010","joined":2010,"initials":"SB","color":"#52b788","research":["Computational Geometry","Delay Tolerant Networks","Mobile Computing"],"subjects":["Computational Geometry","Advanced Algorithms"],"lab":null,"profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p021","name":"Dr. Subhasish Sadhu","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"CSE","email":"ssadhu.cse@nitdgp.ac.in","phone":"+91-9434788160","joined":2008,"initials":"SS","color":"#f3722c","research":["Image Compression","Image Segmentation","Computer Vision"],"subjects":["Digital Image Processing","Computer Vision"],"lab":"Image Processing Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p022","name":"Dr. Abhijit Sharma","designation":"Assistant Professor","designation_short":"Asst. Prof.","department":"CSE","email":"asharma.cse@nitdgp.ac.in","phone":"+91-9434789008","joined":2010,"initials":"AS","color":"#90be6d","research":["Adaptive & Inclusive Technology","Accessibility","HCI"],"subjects":["Human-Computer Interaction","Software Engineering"],"lab":"Accessibility & Inclusive Tech Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p023","name":"Dr. Anuradha Acharyya","designation":"Assistant Professor","designation_short":"Asst. Prof.","department":"CSE","email":"aacharyya.cse@nitdgp.ac.in","phone":"+91-9953167384","joined":2022,"initials":"AA","color":"#c77dff","research":["Database Management Systems","Knowledge Systems","Semantic Web"],"subjects":["Database Management Systems","Knowledge Representation"],"lab":null,"profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p024","name":"Dr. Dilip Kumar Kisku","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"CSE","email":"drkisku.cse@nitdgp.ac.in","phone":"+91-9732111234","joined":2014,"initials":"DK","color":"#e63946","research":["Image Processing","Medical Imaging","Communication Systems","Biometric Security"],"subjects":["Digital Image Processing","Medical Image Analysis"],"lab":"Medical Imaging Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  // ── ECE DEPARTMENT
  {"id":"e001","name":"Dr. Santi Kumar Kundu","designation":"Professor & HOD","designation_short":"HOD","department":"ECE","email":"skundu.ece@nitdgp.ac.in","phone":"+91-9434788127","joined":1995,"initials":"SK","color":"#1b4332","research":["Microelectronics","VLSI Design","Semiconductor Devices"],"subjects":["Microelectronics","VLSI Design","Electronic Devices & Circuits"],"lab":"VLSI Research Lab","profile_url":"https://nitdgp.ac.in/department/electronics-and-communication-engineering/faculty-6"},
  {"id":"e002","name":"Dr. A. K. Bhattacharjee","designation":"Professor","designation_short":"Professor","department":"ECE","email":"akbhattacharjee.ece@nitdgp.ac.in","phone":"+91-9434788021","joined":1988,"initials":"AB","color":"#264653","research":["Digital Signal Processing","Digital Image Processing","VLSI"],"subjects":["Digital Signal Processing","Signal & Systems"],"lab":"Signal Processing Lab","profile_url":"https://nitdgp.ac.in/department/electronics-and-communication-engineering/faculty-6"},
  {"id":"e003","name":"Dr. Gopi Krishna Mahanti","designation":"Professor","designation_short":"Professor","department":"ECE","email":"gkmahanti.ece@nitdgp.ac.in","phone":"+91-9434788107","joined":1996,"initials":"GM","color":"#2d6a4f","research":["VLSI Design","High-performance Computing","Embedded Systems"],"subjects":["VLSI Design","Digital Electronics","Computer Architecture"],"lab":"VLSI Lab","profile_url":"https://nitdgp.ac.in/department/electronics-and-communication-engineering/faculty-6"},
  {"id":"e004","name":"Dr. Durbadal Mandal","designation":"Professor","designation_short":"Professor","department":"ECE","email":"dmondal.ece@nitdgp.ac.in","phone":"+91-9434788059","joined":2000,"initials":"DM","color":"#6a0572","research":["Array Antenna Synthesis","Printed Antenna","Metamaterials","Evolutionary Optimization"],"subjects":["Antenna & Wave Propagation","Electromagnetic Theory"],"lab":"Microwave & Antenna Research Lab","profile_url":"https://nitdgp.ac.in/department/electronics-and-communication-engineering/faculty-6"},
  {"id":"e005","name":"Dr. Sujit Kumar Dey Roy","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"ECE","email":"sdroy.ece@nitdgp.ac.in","phone":"+91-9434788166","joined":2000,"initials":"SD","color":"#457b9d","research":["Metal Oxide Semiconductor Gas Sensors","Nanotechnology","IoT Sensors"],"subjects":["Electronic Devices","Sensors & Instrumentation"],"lab":"Nano Device Lab","profile_url":"https://nitdgp.ac.in/department/electronics-and-communication-engineering/faculty-6"},
  {"id":"e006","name":"Dr. Ashis Kumar Mal","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"ECE","email":"akmal.ece@nitdgp.ac.in","phone":"+91-9434788052","joined":2007,"initials":"AM","color":"#e9c46a","research":["Network-based Computational Biology","Medical Image Analysis","VLSI","Neuromorphic Circuits"],"subjects":["Microelectronics & VLSI","Digital Electronics"],"lab":"SMDP VLSI Laboratory","profile_url":"https://nitdgp.ac.in/department/electronics-and-communication-engineering/faculty-6"},
  {"id":"e007","name":"Dr. Anup Kumar Majumder","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"ECE","email":"amajumder.ece@nitdgp.ac.in","phone":"+91-9434788168","joined":2006,"initials":"AM","color":"#e63946","research":["Antenna Optimization","Signal Processing","Soft Computing"],"subjects":["Antenna Design","Communication Systems"],"lab":"Antenna & Microwave Lab","profile_url":"https://nitdgp.ac.in/department/electronics-and-communication-engineering/faculty-6"},
  {"id":"e008","name":"Dr. Rowdra Ghatak","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"ECE","email":"rghatak.ece@nitdgp.ac.in","phone":"+91-9434788125","joined":2010,"initials":"RG","color":"#f4a261","research":["Wireless Communication","Radio Resource Management","Fractal Antennas"],"subjects":["Wireless Communication","Mobile Communication"],"lab":"Wireless Communication Research Lab","profile_url":"https://nitdgp.ac.in/department/electronics-and-communication-engineering/faculty-6"},
  {"id":"e009","name":"Dr. Rathindranath Mahapatra","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"ECE","email":"rmahapatra.ece@nitdgp.ac.in","phone":"+91-9434788126","joined":2010,"initials":"RM","color":"#52b788","research":["Integrated Circuits","Transceiver Design","RF/Analog VLSI"],"subjects":["Analog Electronics","RF Circuit Design"],"lab":"5G Lab","profile_url":"https://nitdgp.ac.in/department/electronics-and-communication-engineering/faculty-6"},
  {"id":"e010","name":"Dr. Himadri Kumar Mondal","designation":"Assistant Professor","designation_short":"Asst. Prof.","department":"ECE","email":"hkmondal.ece@nitdgp.ac.in","phone":"+91-9434789047","joined":2018,"initials":"HM","color":"#3a0ca3","research":["Wireless Communications","Cross-layer Design","5G Networks"],"subjects":["5G & Beyond","Digital Communication"],"lab":"5G Lab","profile_url":"https://nitdgp.ac.in/department/electronics-and-communication-engineering/faculty-6"},
  {"id":"e011","name":"Dr. Suman Ranwa","designation":"Assistant Professor","designation_short":"Asst. Prof.","department":"ECE","email":"sranwa.ece@nitdgp.ac.in","phone":"+91-9434789034","joined":2018,"initials":"SR","color":"#90be6d","research":["Antenna Array Synthesis","Evolutionary Algorithms","Microwave Engineering"],"subjects":["Microwave Engineering","Antenna Design"],"lab":"Microwave & Antenna Research Lab","profile_url":"https://nitdgp.ac.in/department/electronics-and-communication-engineering/faculty-6"},
  {"id":"e012","name":"Dr. Nilotpal Chattaraj","designation":"Assistant Professor","designation_short":"Asst. Prof.","department":"ECE","email":"nchattaraj.ece@nitdgp.ac.in","phone":"","joined":2018,"initials":"NC","color":"#c77dff","research":["Semiconductor Device Simulation","Analytical Modeling","Nanoelectronics"],"subjects":["Electronic Devices & Circuits","Semiconductor Physics"],"lab":"Electronic Device Research Lab","profile_url":"https://nitdgp.ac.in/department/electronics-and-communication-engineering/faculty-6"},
  {"id":"e013","name":"Dr. Nripendra Biswas","designation":"Assistant Professor","designation_short":"Asst. Prof.","department":"ECE","email":"nbiswas.ece@nitdgp.ac.in","phone":"+91-9434789079","joined":2022,"initials":"NB","color":"#d62828","research":["Smart Materials","Piezoelectric Devices","Energy Harvesting"],"subjects":["Sensors & Transducers","Materials Science"],"lab":"Nano Device Lab","profile_url":"https://nitdgp.ac.in/department/electronics-and-communication-engineering/faculty-6"},
  {"id":"e014","name":"Dr. Rana Das","designation":"Assistant Professor","designation_short":"Asst. Prof.","department":"ECE","email":"rdas.ece@nitdgp.ac.in","phone":"+91-9434789080","joined":2022,"initials":"RD","color":"#4cc9f0","research":["Non-Volatile Memory","Resistive Memory Devices","Memristors"],"subjects":["Electronic Devices","Nanotechnology"],"lab":"Electronic Device Research Lab","profile_url":"https://nitdgp.ac.in/department/electronics-and-communication-engineering/faculty-6"},
  {"id":"e015","name":"Dr. Abhishek Choubey","designation":"Assistant Professor","designation_short":"Asst. Prof.","department":"ECE","email":"achoubey.ece@nitdgp.ac.in","phone":"","joined":2023,"initials":"AC","color":"#f3722c","research":["Analog & Mixed-Signal VLSI","Nano Fabrication","Low-Power Circuit Design"],"subjects":["Analog Electronics","VLSI Design"],"lab":"VLSI Research Lab","profile_url":"https://nitdgp.ac.in/department/electronics-and-communication-engineering/faculty-6"},
  // ── EE DEPARTMENT
  {"id":"ee001","name":"Dr. T. K. Saha","designation":"Professor","designation_short":"Professor","department":"EE","email":"tksaha.ee@nitdgp.ac.in","phone":"+91-9434788173","joined":1992,"initials":"TS","color":"#1d3557","research":["Power Systems","Power Quality","Smart Grid"],"subjects":["Power Systems","Electrical Machines","Power Electronics"],"lab":"Power Systems Lab","profile_url":"https://nitdgp.ac.in/department/electrical-engineering/faculty"},
  {"id":"ee002","name":"Dr. N. K. Roy","designation":"Professor","designation_short":"Professor","department":"EE","email":"nkroy.ee@nitdgp.ac.in","phone":"+91-9434788173","joined":1994,"initials":"NR","color":"#457b9d","research":["Control Systems","Robotics","Automation"],"subjects":["Control Systems","Robotics","Industrial Automation"],"lab":"Control & Automation Lab","profile_url":"https://nitdgp.ac.in/department/electrical-engineering/faculty"},
  {"id":"ee003","name":"Dr. S. S. Thakur","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"EE","email":"ssthakur.ee@nitdgp.ac.in","phone":"+91-9434788173","joined":2002,"initials":"ST","color":"#2d6a4f","research":["Power Electronics","Drives","Renewable Energy"],"subjects":["Power Electronics","Electric Drives","Renewable Energy Systems"],"lab":"Power Electronics Lab","profile_url":"https://nitdgp.ac.in/department/electrical-engineering/faculty"},
  {"id":"ee004","name":"Dr. S. N. Mahato","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"EE","email":"snmahato.ee@nitdgp.ac.in","phone":"+91-9434788057","joined":2005,"initials":"SM","color":"#e76f51","research":["Electric Machines","Power System Protection","High Voltage Engineering"],"subjects":["Electrical Machines","High Voltage Engineering"],"lab":"High Voltage Lab","profile_url":"https://nitdgp.ac.in/department/electrical-engineering/faculty"},
  {"id":"ee005","name":"Dr. S. Banerjee","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"EE","email":"sbanerjee.ee@nitdgp.ac.in","phone":"+91-9434788173","joined":2006,"initials":"SB","color":"#6a0572","research":["Signal Processing","Biomedical Engineering","Instrumentation"],"subjects":["Signals & Systems","Biomedical Instrumentation"],"lab":"Biomedical Engineering Lab","profile_url":"https://nitdgp.ac.in/department/electrical-engineering/faculty"},
  {"id":"ee006","name":"Dr. C. Koley","designation":"Associate Professor","designation_short":"Assoc. Prof.","department":"EE","email":"ckoley.ee@nitdgp.ac.in","phone":"+91-9434788173","joined":2008,"initials":"CK","color":"#0077b6","research":["Power System Stability","FACTS Devices","Smart Metering"],"subjects":["Power System Analysis","FACTS & Custom Power"],"lab":"Smart Grid Lab","profile_url":"https://nitdgp.ac.in/department/electrical-engineering/faculty"},
  // ── Mathematics
  {"id":"m001","name":"Prof. (HOD) Mathematics","designation":"Professor & HOD","designation_short":"HOD","department":"Mathematics","email":"hod.maths@nitdgp.ac.in","phone":"+91-9434788192","joined":1996,"initials":"HM","color":"#264653","research":["Applied Mathematics","Numerical Methods","Optimization"],"subjects":["Mathematics-I","Mathematics-II","Numerical Methods"],"lab":null,"profile_url":"https://nitdgp.ac.in/department/mathematics"},
  // ── Physics
  {"id":"ph001","name":"Prof. (HOD) Physics","designation":"Professor & HOD","designation_short":"HOD","department":"Physics","email":"hod.phy@nitdgp.ac.in","phone":"+91-9434788050","joined":1998,"initials":"HP","color":"#b5451b","research":["Condensed Matter Physics","Nanomaterials","Photonics"],"subjects":["Engineering Physics","Quantum Mechanics","Optics"],"lab":"Physics Lab","profile_url":"https://nitdgp.ac.in/department/physics"},
  // ── Civil
  {"id":"ce001","name":"Prof. (HOD) Civil Engineering","designation":"Professor & HOD","designation_short":"HOD","department":"Civil","email":"hod.ce@nitdgp.ac.in","phone":"+91-9434788156","joined":1997,"initials":"HC","color":"#52b788","research":["Structural Engineering","Geotechnical Engineering","Construction Management"],"subjects":["Structural Analysis","Fluid Mechanics","Environmental Engineering"],"lab":"Structural Engineering Lab","profile_url":"https://nitdgp.ac.in/department/civil-engineering"},
  {"id":"ce002","name":"Dr. V. K. Dwivedi","designation":"Professor","designation_short":"Professor","department":"Civil","email":"vkdwivedi.ce@nitdgp.ac.in","phone":"","joined":2001,"initials":"VD","color":"#3a0ca3","research":["Transportation Engineering","Pavement Design","Traffic Engineering"],"subjects":["Transportation Engineering","Highway Engineering"],"lab":"Transportation Lab","profile_url":"https://nitdgp.ac.in/department/civil-engineering"},
  // ── ME
  {"id":"me001","name":"Prof. (HOD) Mechanical Engineering","designation":"Professor & HOD","designation_short":"HOD","department":"ME","email":"hod.me@nitdgp.ac.in","phone":"+91-9434788051","joined":1993,"initials":"HM","color":"#e63946","research":["Manufacturing Engineering","CAD/CAM","Thermal Engineering"],"subjects":["Thermodynamics","Fluid Mechanics","Manufacturing Processes"],"lab":"Manufacturing Lab","profile_url":"https://nitdgp.ac.in/department/mechanical-engineering"},
  {"id":"me002","name":"Dr. N. B. Hui","designation":"Professor","designation_short":"Professor","department":"ME","email":"nbhui.me@nitdgp.ac.in","phone":"","joined":1999,"initials":"NH","color":"#f3722c","research":["Robotics","Machine Design","Mechatronics"],"subjects":["Theory of Machines","Machine Design","Robotics"],"lab":"Robotics & Automation Lab","profile_url":"https://nitdgp.ac.in/department/mechanical-engineering"},
];

const DEPARTMENTS = ["All", "CSE", "ECE", "EE", "ME", "Civil", "Mathematics", "Physics"];

const designationBadge = (d: string) => {
  if (d === "Professor" || d === "HOD") return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
  if (d === "Assoc. Prof.") return "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300";
  return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300";
};

const YEAR_KEYWORDS: Record<string, string[]> = {
  "1st Year": ["Programming", "Mathematics", "Physics", "Chemistry", "Engineering Drawing"],
  "2nd Year": ["Data Structures", "Digital Electronics", "Discrete", "Computer Organisation"],
  "3rd Year": ["Algorithms", "Operating Systems", "Computer Networks", "DBMS", "Software Engineering"],
  "4th Year": ["Machine Learning", "Deep Learning", "Cryptography", "NLP", "Computer Vision", "Distributed"],
};

const MY_SUBJECTS = [
  "Data Structures & Algorithms", "Operating Systems", "Computer Networks",
  "Database Management Systems", "Software Engineering",
];

const matchesYear = (prof: Professor, year: string): boolean => {
  const keywords = YEAR_KEYWORDS[year];
  if (!keywords) return true;
  return prof.subjects.some(s => keywords.some(k => s.toLowerCase().includes(k.toLowerCase())));
};

const matchesMySubjects = (prof: Professor): boolean => {
  return prof.subjects.some(s => MY_SUBJECTS.some(ms => s.toLowerCase().includes(ms.toLowerCase()) || ms.toLowerCase().includes(s.toLowerCase())));
};

const Professors = () => {
  const [professors, setProfessors] = useState<Professor[]>(FALLBACK_PROFESSORS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [desFilter, setDesFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All Years");
  const [expFilter, setExpFilter] = useState("Any");
  const [labOnly, setLabOnly] = useState(false);
  const [teachingMe, setTeachingMe] = useState(false);
  const [sortBy, setSortBy] = useState("senior");
  const [selected, setSelected] = useState<Professor | null>(null);

  useEffect(() => {
    supabase
      .from("professors")
      .select("id,name,designation,designation_short,email,phone,joined,initials,color,research,subjects,lab,profile_url")
      .order("joined")
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setProfessors(data as Professor[]);
        }
        setLoading(false);
      });
  }, []);

  const fuse = useMemo(() => new Fuse(professors, {
    keys: ["name", "subjects", "research", "department"],
    threshold: 0.35,
  }), [professors]);

  const filtered = useMemo(() => {
    let list = search.trim() ? fuse.search(search).map(r => r.item) : [...professors];

    if (desFilter !== "All") {
      list = list.filter(p => p.designation_short === desFilter);
    }
    if (deptFilter !== "All") {
      list = list.filter(p => (p.department || "CSE") === deptFilter);
    }
    if (yearFilter !== "All Years") {
      list = list.filter(p => matchesYear(p, yearFilter));
    }
    if (expFilter !== "Any") {
      list = list.filter(p => {
        const exp = 2026 - p.joined;
        if (expFilter === "<5") return exp < 5;
        if (expFilter === "5-10") return exp >= 5 && exp <= 10;
        if (expFilter === "10-20") return exp > 10 && exp <= 20;
        if (expFilter === "20+") return exp > 20;
        return true;
      });
    }
    if (labOnly) list = list.filter(p => p.lab);
    if (teachingMe) list = list.filter(matchesMySubjects);

    list.sort((a, b) => {
      if (sortBy === "senior") return a.joined - b.joined;
      if (sortBy === "junior") return b.joined - a.joined;
      if (sortBy === "az") return a.name.localeCompare(b.name);
      if (sortBy === "designation") {
        const order: Record<string, number> = { "HOD": 0, "Professor": 1, "Assoc. Prof.": 2, "Asst. Prof.": 3 };
        return (order[a.designation_short] ?? 9) - (order[b.designation_short] ?? 9);
      }
      return 0;
    });

    return list;
  }, [search, desFilter, deptFilter, yearFilter, expFilter, labOnly, teachingMe, sortBy, professors, fuse]);

  const labCount = professors.filter(p => p.lab).length;
  const currentYear = new Date().getFullYear();
  const joinedYears = professors.map(p => p.joined);
  const minYear = Math.min(...joinedYears);
  const maxYear = Math.max(...joinedYears);

  const activeFilterCount = [
    desFilter !== "All",
    deptFilter !== "All",
    yearFilter !== "All Years",
    expFilter !== "Any",
    labOnly,
    teachingMe,
  ].filter(Boolean).length;

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success("Email copied!");
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="scroll-reveal">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
          <GraduationCap className="h-6 w-6" style={{ color: "hsl(var(--primary))" }} />
          Faculty &amp; Staff — NIT Durgapur
        </h1>
        <p className="text-sm text-muted-foreground mt-1">National Institute of Technology, Durgapur</p>
        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
          <span className="font-medium">{professors.length} Professors</span>
          <span>•</span>
          <span>{labCount} with Labs</span>
          <span>•</span>
          <span>{minYear}–{maxYear}</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="scroll-reveal space-y-3" style={{ transitionDelay: "70ms" }}>
        {/* Row 1: Search + Department pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search name, subject, research…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
          </div>
          {DEPARTMENTS.map(d => (
            <button key={d} onClick={() => setDeptFilter(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${deptFilter === d ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"}`}
            >{d}</button>
          ))}
        </div>

        {/* Row 2: Designation pills + filters + sort */}
        <div className="flex flex-wrap items-center gap-3">
          {["All", "HOD", "Professor", "Assoc. Prof.", "Asst. Prof."].map(d => (
            <button key={d} onClick={() => setDesFilter(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${desFilter === d ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"}`}
            >{d === "All" ? "All Designations" : d}</button>
          ))}

          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["All Years", "1st Year", "2nd Year", "3rd Year", "4th Year"].map(y => (
                <SelectItem key={y} value={y} className="text-xs">{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={expFilter} onValueChange={setExpFilter}>
            <SelectTrigger className="h-8 w-[120px] text-xs">
              <SelectValue placeholder="Experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Any" className="text-xs">Any Exp.</SelectItem>
              <SelectItem value="<5" className="text-xs">&lt;5 years</SelectItem>
              <SelectItem value="5-10" className="text-xs">5–10 years</SelectItem>
              <SelectItem value="10-20" className="text-xs">10–20 years</SelectItem>
              <SelectItem value="20+" className="text-xs">20+ years</SelectItem>
            </SelectContent>
          </Select>

          <button onClick={() => setLabOnly(!labOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1 ${labOnly ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700" : "bg-card text-muted-foreground border-border hover:border-primary/40"}`}
          ><FlaskConical className="h-3.5 w-3.5" /> Has Lab</button>

          <button onClick={() => setTeachingMe(!teachingMe)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1 ${teachingMe ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"}`}
          ><UserCheck className="h-3.5 w-3.5" /> Teaching Me</button>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-8 w-[140px] text-xs ml-auto">
              <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="senior" className="text-xs">Most Senior</SelectItem>
              <SelectItem value="junior" className="text-xs">Most Junior</SelectItem>
              <SelectItem value="az" className="text-xs">A–Z Name</SelectItem>
              <SelectItem value="designation" className="text-xs">By Designation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active filter count + result count */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-medium">{filtered.length} professor{filtered.length !== 1 ? "s" : ""} found</span>
          {activeFilterCount > 0 && (
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
              {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
            </Badge>
          )}
        </div>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-56 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          {deptFilter !== "All"
            ? `No faculty from ${deptFilter} department added yet.`
            : "No professors match your filters."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <div key={p.id} className="scroll-reveal rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors flex flex-col gap-3" style={{ transitionDelay: `${(i % 6) * 70}ms` }}>
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0" style={{ backgroundColor: p.color }}>{p.initials}</div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground text-sm truncate">{p.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge className={`text-[10px] ${designationBadge(p.designation_short)}`}>{p.designation_short}</Badge>
                    {p.department && <Badge variant="outline" className="text-[10px]">{p.department}</Badge>}
                  </div>
                </div>
              </div>
              <div className="border-t border-border pt-3 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => copyEmail(p.email)}>
                  <Mail className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{p.email}</span>
                </div>
                <div className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 shrink-0" />Joined {p.joined}</div>
              </div>
              <div className="border-t border-border pt-3 flex flex-wrap gap-1.5">
                {p.research.slice(0, 2).map(r => (
                  <span key={r} className="px-2 py-0.5 rounded-full bg-muted text-[10px] text-muted-foreground">{r}</span>
                ))}
                {p.research.length > 2 && <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] text-muted-foreground">+{p.research.length - 2} more</span>}
              </div>
              {p.lab && (
                <div className="flex items-center gap-1.5 text-xs">
                  <FlaskConical className="h-3.5 w-3.5" style={{ color: "#f59e0b" }} />
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-[10px] font-medium">{p.lab}</span>
                </div>
              )}
              <Button variant="outline" size="sm" className="mt-auto text-xs w-full" onClick={() => setSelected(p)}>
                View Profile <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over panel */}
      <Sheet open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <div className="space-y-6 pt-2">
              <SheetHeader className="flex-row items-center gap-4 space-y-0">
                <div className="h-20 w-20 rounded-full flex items-center justify-center text-white font-bold text-2xl shrink-0" style={{ backgroundColor: selected.color }}>{selected.initials}</div>
                <div>
                  <SheetTitle className="text-lg">{selected.name}</SheetTitle>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge className={`${designationBadge(selected.designation_short)}`}>{selected.designation}</Badge>
                    {selected.department && <Badge variant="outline">{selected.department}</Badge>}
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Joined NIT Durgapur: {selected.joined} ({currentYear - selected.joined} years)</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{selected.email}</span>
                  <button onClick={() => copyEmail(selected.email)} className="text-muted-foreground hover:text-foreground"><Copy className="h-3.5 w-3.5" /></button>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selected.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Subjects Taught</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.subjects.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Research Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.research.map(r => <Badge key={r} variant="outline" className="text-xs">{r}</Badge>)}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Lab</h4>
                {selected.lab ? (
                  <div className="flex items-center gap-2 text-sm">
                    <FlaskConical className="h-4 w-4" style={{ color: "#f59e0b" }} /><span>{selected.lab}</span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No dedicated lab</p>
                )}
              </div>

              <a href={selected.profile_url} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="outline" className="w-full text-sm">View on NIT Durgapur Website <ExternalLink className="h-4 w-4 ml-1" /></Button>
              </a>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Professors;
