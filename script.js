
let songs;
let currentsong= new Audio();
const  getsongs= async() =>{
    let a=await fetch("http://127.0.0.1:5500/songs/");
    let response= await a.text();
    let div = document.createElement("div");
    div.innerHTML=response;
    let as= div.getElementsByTagName("a");
    let songs=[];
    for(let index=0; index< as.length; index++){
        const element= as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split('/songs/')[1]);
        }
    }
    return songs;
} 
const playMusic = (track) =>{
    // let audio=new Audio(track);
    currentsong.src=track;
    currentsong.play();
    play.src="pause.svg"
    let songname=track.slice(6, track.length-4).replaceAll("%20", " ");
    document.querySelector(".songinfo").innerHTML=songname
    
}
async function main(){
    
    songs=await getsongs();
    console.log(songs)

    var audio= new Audio(songs[0]);
    // audio.play();

    audio.addEventListener("loadeddata", ()=>{
        console.log(audio.duration, audio.currentSrc, audio.currentTime)
    });
    let songslist=document.querySelector(".songslist").getElementsByTagName('ul')[0];
    for (const song of songs) {
        let h=song.slice(0, song.length-4).replaceAll("%20", " ");
       
        songslist.innerHTML=songslist.innerHTML + `<li><div class="songtile flex">
                                    <span class="mus">
                                        <img src="muslogo.svg" alt="">
                                    </span>
                                    <span class="contents">
                                        <div class="stitle">${h}</div>
                                        <div class="sinfo">Singer</div>
                                    </span>
                                    <span class="playnbutton">
                                        <div>
                                            Play Now
                                        </div>
                                    </span>
                                    <span class="tileplogo">
                                        <img src="playbar_playbuttn.svg" alt="">
                                    </span>
                                </div>
        </li>`;
    }


    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(
        e=>{
            e.addEventListener("click", element=>{
                console.log(e.querySelector(".contents").firstElementChild.innerHTML)
                let songName = e.querySelector(".contents").firstElementChild.innerHTML;
                let formattedSongName = songName.replaceAll(" ", "%20"); // Keeping the encoding for spaces
                let filePath = `songs/${formattedSongName}.mp3`;
                playMusic(filePath);
            })
        }
    )

    play.addEventListener("click", ()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src = "pause.svg"
        }else{
            currentsong.pause()
            play.src="playbar_playbutton.svg"
        }
    })

    // currentsong.addEventListener("timeupdate", ()=>{
    //     console.log(currentsong.currentTime, currentsong.duration)
    // })

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const formattedSecs = secs < 10 ? `0${secs}` : secs;
        return `${minutes}:${formattedSecs}`;
    }
    
    currentsong.addEventListener("timeupdate", () => {
        const currentTime = formatTime(currentsong.currentTime);
        const duration = formatTime(currentsong.duration);
        console.log(`${currentTime}/${duration}`);
        document.querySelector(".duration").innerHTML=`${currentTime}/${duration}`
        document.querySelector(".seekbarfull").style.width = `${(currentsong.currentTime / currentsong.duration) * 100}%`;
        console.log(`${(currentsong.currentTime/currentsong.duration)*100} %`)
    });

    // document.querySelector(".seekbar").addEventListener("click", e=>{
    //     if(currentsong.currentTime!=null){
    //         let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
    //         document.querySelector(".seekbarfull").style.width=`${percent}%`;
    //         currentsong.currentTime= ((currentsong.duration)*percent)/100;
    //     }
    // })

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        if(currentsong.currentTime!=null){

            const seekbar = e.target.getBoundingClientRect();
            
            // Calculate the click position as a percentage of the seekbar width
            const percent = (e.clientX - seekbar.left) / seekbar.width;
            
            // Update song's current time based on the percentage clicked
            currentsong.currentTime = currentsong.duration * percent;
        }
    });


    prev.addEventListener("click", () => {
        
        console.log(currentsong.src.split("/").slice(-1)[0])
        let track=`songs/${songs[(songs.indexOf(currentsong.src.split("/").slice(-1)[0]) - 1 + songs.length) % songs.length]}`
        playMusic(track)

    });
    next.addEventListener("click", () => {
        
        console.log(currentsong.src.split("/").slice(-1)[0])
        let track=`songs/${songs[(songs.indexOf(currentsong.src.split("/").slice(-1)[0]) + 1) % songs.length]}`
        playMusic(track)

    });
    
   play_button.addEventListener("click", ()=>{
    console.log("I was clicked")
   })
}




main()