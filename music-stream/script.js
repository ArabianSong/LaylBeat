let songs=[

{
title:"أنت Zero,
artist:"LaylBeat",
file:"songs/song1.mp3",
cover:"covers/song1.jpg",
lyrics:"lyrics/song1.lrc"
}

]

let audio=document.getElementById("audio")
let title=document.getElementById("title")
let artist=document.getElementById("artist")
let cover=document.getElementById("cover")
let lyricsBox=document.getElementById("lyrics")
let playlist=document.getElementById("playlist")
let progress=document.getElementById("progress")

let index=0
let lyrics=[]

function loadSong(){

let s=songs[index]

title.innerText=s.title
artist.innerText=s.artist
cover.src=s.cover

fetch(s.file)
.then(r=>r.blob())
.then(b=>audio.src=URL.createObjectURL(b))

loadLyrics(s.lyrics)

}

function playSong(){

audio.play()

}

Night nextSong(){

index++

if(index>=songs.length) index=0

loadSong()
audio.play()

}

function prevSong(){

index--

if(index<0) index=songs.length-1

loadSong()
audio.play()

}

audio.ontimeupdate=()=>{

progress.value=(audio.currentTime/audio.duration)*100

updateLyrics()

}

progress.oninput=()=>{

audio.currentTime=(progress.value/100)*audio.duration

}

function loadLyrics(file){

fetch(file)

.then(r=>r.text())

.then(t=>{

lyrics=[]

lyricsBox.innerHTML=""

let lines=t.split("\n")

lines.forEach(l=>{

let match=l.match(/\[(\d+):(\d+)/)

if(match){

let time=parseInt(match[1])*60+parseInt(match[2])

let text=l.replace(/\[.*\]/,"")

lyrics.push({time,text})

let p=document.createElement("p")

p.innerText=text

p.className="line"

lyricsBox.appendChild(p)

}

})

})

}

function updateLyrics(){

let lines=document.querySelectorAll(".line")

lyrics.forEach((l,i)=>{

if(audio.currentTime>=l.time){

lines.forEach(x=>x.classList.remove("active"))

lines[i].classList.add("active")

}

})

}

function loadPlaylist(){

songs.forEach((s,i)=>{

let div=document.createElement("div")

div.className="song"

div.innerText=s.title+" - "+s.artist

div.onclick=()=>{

index=i

loadSong()
audio.play()

}

playlist.appendChild(div)

})

}

document.getElementById("search").oninput=function(){

let q=this.value.toLowerCase()

document.querySelectorAll(".song").forEach(s=>{

s.style.display=s.innerText.toLowerCase().includes(q)?"block":"none"

})

}

document.addEventListener("contextmenu",e=>e.preventDefault())

document.onkeydown=e=>{

if(e.keyCode==123) return false
if(e.ctrlKey && e.shiftKey && e.keyCode==73) return false
if(e.ctrlKey && e.keyCode==85) return false

}

lyricsBox.oncopy=()=>false

loadSong()

loadPlaylist()
