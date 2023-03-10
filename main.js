
// 1. Render songs
// 2. Scroll top
// 3. Play / pause / seek 
// 4. CD rotate 
// 5. Next / prev
// 6. Random
// 7. Next / repeat when ended
// 8. Active songs
// 9. Scroll active song into view
// 10. Play song when click


const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const song = $('.song');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},//get là lấy ra
    songs:[//danh sach cac bai hat
            {
		   
		    name: 'Quý cô say xỉn',
                singer: 'Phùng Khánh Linh',
                path: './assets/music/QuyCoSayXinsecretSunday-PhungKhanhLinh-8246231.mp3',
                image: './assets/img/quy-co-say-xin.jpg'
            },
            {
                name: 'Đắm',
                singer: 'Xesi-RickyStar',
                path: './assets/music/Dam-XesiRickyStar-7043873.mp3',
                image: './assets/img/dam.jpg'
            },
            {
                name: 'Mong một ngày anh nhớ đến em',
                singer: 'HuynhJames-Pjnboys',
                path: './assets/music/MongMotNgayAnhNhoDenEm-HuynhJamesPjnboys-8653756.mp3',
                image: './assets/img/mong-mot-ngay-anh-nho-den-em.jpg'
            },
            {
                name: 'Anh ơi có biết',
                singer: 'Hoaprox-LinhCao-DangMinh',
                path: './assets/music/AnhOiCoBiet-HoaproxLinhCaoDangMinh-7610944.mp3',
                image: './assets/img/anh-oi-co-biet.jpg'
            },
            {
                name: 'Dự báo thời tiết hôm nay mưa',
                singer: 'GREYD',
                path: './assets/music/DuBaoThoiTietHomNayMua-GREYD-8255553.mp3',
                image: './assets/img/du-bao-thoi-tiet-hom-nay-mua.jpg'
            },
            {
                name: 'Cô đơn trên sofa',
                singer: 'Hồ Ngọc Hà',
                path: './assets/music/CoDonTrenSofa-HoNgocHa-8093720.mp3',
                image: './assets/img/co-don-tren-sofa.jpg'
            }

        ],
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config)) //set là thêm vào
    },
    render: function(){//render để render ra view các bài hát
        // console.log(123456);
        const html = this.songs.map((song, index) => {//this.songs để chọc lên cái mảng songs trên kia
            //lấy ra từng cái song
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            
            `;
        });
        $('.playlist').innerHTML = html.join('');
    },
    definedProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function(){
        const _this = this;
        const cdWidth = cd.offsetWidth;
        
        //Xữ lí CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([//animate nhận vào đối số là 1 mảng, đối số thứ 2 này thể hiện cái cd quay như nào
            {
                transform: 'rotate(360deg)'
            }

        ], {
            duration: 10000, //10 giây
            interations: Infinity //vô hạn
        });
        cdThumbAnimate.pause();

        //Xữ lí phóng to / thu nhỏ cd
        document.onscroll = function(){//lắng nghe sự kiện kéo thanh cuộn trên toàn bộ trang 
            // console.log(window.scrollY); //window là biến đại diện cho cửa sổ màn hình, scrollY là trục dọc trong trục tọa độ
            // console.log(document.documentElement.scrollTop);//tương tự như cái trên
            const scrollTop = window.scrollY || document.documentElement.scrollTop; //nếu có cái này thì lấy cái này nếu không có thì lấy cái kia
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0; //nếu newCdWidth lớn hơn 0 thì lấy newCdWidth + 'px' còn ngược lại thì lấy 0
            cd.style.opacity = newCdWidth / cdWidth;
        }
        //xữ lí khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }
            else{
                audio.play();
            }
        }
        //khi song được play
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        //khi song bị pause 
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if( audio.duration){
                const progressPersent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPersent;
                // console.log(audio.currentTime);
            }
        }
        //xữ lí khi tua song
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime; 
            
        }
        //Khi next song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }
            else{
                 _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        //Khi prev song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }
            else{
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        //Xữ lí bậc tắt random song
        randomBtn.onclick = function(e){
            // _this.isRandom == false ? randomBtn.classList.add('active') : randomBtn.classList.remove('active');
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
            
        }
        //Xữ lí lặp lại 1 song
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
            
        }

        //Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if( songNode || e.target.closest('.option')){
                //Xữ lí click vào song
                if(songNode){
                    // console.log(songNode.getAttribute('data-index'));
                    // //tương tự 
                    // console.log(songNode.dataset.index);
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                //Xữ lí vào option
                if(e.target.closest('.option')){

                }
            }
        }

        //Xữ lí next song khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }
            else{
                nextBtn.click();
            }
            
        }

       

    },  
    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 200);
    },
    loadCurrentSong: function(){//tải bài hát hiện tại
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;

    },
    nextSong: function(){
        this.currentIndex ++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex --;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function(){
        // const random = Math.floor(Math.random() * this.songs.length);
        // console.log(random);
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while (newIndex == this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function(){
        //gán cấu hình từ config vào ứng dụng
        this.loadConfig();


        //định nghĩa các thuộc tính cho object
        this.definedProperties();
        //lắng nghe / xữ lí các sự kiện (DOM event)
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();



        //Render playlist
        this.render();

        //Hiển thị trạng thái ban đầu của button repeat và random
        repeatBtn.classList.toggle('active', this.isRepeat);
        randomBtn.classList.toggle('active', this.isRandom);
    }
};
app.start();
