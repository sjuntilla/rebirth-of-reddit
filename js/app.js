    //CONSTANTS
    let box = document.getElementById('box');
    let container = document.getElementById('container');
    box.appendChild(container);

    //ARRAY OF RANDOM SUBREDDITS
    const randomSubreddits = ['https://www.reddit.com/r/WholesomeMemes.json', 'https://www.reddit.com/r/nosleep.json', 'https://www.reddit.com/r/FFXIV.json', 'https://www.reddit.com/r/NatureIsFuckingLit.json', 'https://www.reddit.com/r/rpghorrorstories.json', 'https://www.reddit.com/r/RarePuppers.json', 'https://www.reddit.com/r/MildlyInteresting.json', 'https://www.reddit.com/r/Gunpla.json', 'https://www.reddit.com/r/TodayILearned.json', 'https://www.reddit.com/r/WritingPrompts.json'];

    //HEADER

    let head = document.createElement('div');
    head.className = 'pageHead';
    box.appendChild(head);

    //HELPER FUNCTIONALITY
    const request = (url, callback) => {
        const oReq = new XMLHttpRequest();
        oReq.addEventListener('load', function (data) {
            const rData = JSON.parse(data.target.responseText);
            callback(rData);
        });
        oReq.open('GET', url);
        oReq.send();
    }

    const callback = (post) => {
        let posts = post.data.children;
        console.log(posts);


        //HEADER STUFF
        let subTitle = document.createElement('h2');
        let subredditName = posts[0].data.subreddit_name_prefixed;
        subTitle.innerHTML = subredditName;
        head.appendChild(subTitle);

        //CHANGES BANNER DEPENDING ON SUBREDDIT
        if (subredditName === 'r/AzureLane') {
            head.style.backgroundImage = "url('../assets/azurelanebg.png')";
        } else if (subredditName === 'r/wholesomememes') {
            head.style.backgroundImage = "url('../assets/wholesomememes.png')";
        } else if (subredditName === 'r/rarepuppers') {
            head.style.backgroundImage = "url('../assets/rarepuppers.png')";
        } else if (subredditName === 'r/Gunpla') {
            head.style.backgroundImage = "url('../assets/gunpla.png')";
        } else if (subredditName === 'r/ffxiv') {
            head.style.backgroundImage = "url('../assets/ffxiv.png')";
        } else if (subredditName === 'r/NatureIsFuckingLit') {
            head.style.backgroundImage = "url('../assets/nifl.png')";
        } else {
            head.style.backgroundImage = "url('../assets/headbg.png')";
        }

        let myBoards = document.createElement('button');
        myBoards.innerHTML = 'my boards';
        myBoards.addEventListener('click', myBoard);
        head.appendChild(myBoards);

        let random = document.createElement('button');
        random.innerHTML = 'random subreddit';
        random.addEventListener('click', randomSub);
        head.appendChild(random);

        let getApp = document.createElement('button');
        getApp.innerHTML = 'get the app!';
        getApp.addEventListener('click', randomSub);
        head.appendChild(getApp);

        let testImgur = document.createElement('button');
        testImgur.innerHTML = 'testing';
        testImgur.addEventListener('click', imgurFunc);
        head.appendChild(testImgur);


        posts.forEach(i => {
            let permalink = 'https://reddit.com' + i.data.permalink;
            let author = i.data.author;
            let title = i.data.title;

            //FORMATS TIME FROM DATA.CREATED_UTC
            let utc = i.data.created_utc;
            let date = new Date(utc * 1000);
            let hours = date.getHours();
            let minutes = '0' + date.getMinutes();
            let seconds = '0' + date.getSeconds();
            let day = date.getDate();
            var monthName = new Intl.DateTimeFormat("en-US", {
                month: "long"
            }).format;
            let month = monthName(date);
            let year = date.getFullYear();
            let timestamp = hours + ':' + minutes + ':' + seconds.substr(-2) + ' on ' + day + ' ' + month + ' ' + year;


            //CREATES POSTS + CONTENT
            let postBox = document.createElement('div');
            postBox.className = 'post';
            container.appendChild(postBox);
            let postCont = document.createElement('div');
            postCont.className = 'content';
            postBox.appendChild(postCont);

            let header = document.createElement('div');
            header.className = 'postHeader';
            postCont.appendChild(header);
            let aTitle = document.createElement('a');
            header.appendChild(aTitle);
            aTitle.href = permalink;
            let subject = document.createElement('h3');
            aTitle.appendChild(subject);
            subject.innerHTML = title;

            let details = document.createElement('div');
            details.className = 'details';
            details.innerHTML = author + ' posted this on ' + timestamp;
            header.appendChild(details);
            //HANDLES POST IMAGES
            let pImg = document.createElement('a');
            postCont.appendChild(pImg);
            pImg.href = i.data.url;
            let img = document.createElement('img');
            let thumbnail = i.data.thumbnail;
            pImg.appendChild(img);
            const noImg = '../assets/noimg.png';
            const nsfwImg = '../assets/nsfwImg.png';
            if (i.data.thumbnail === 'self' || i.data.thumbnail === 'default' || i.data.thumbnail === 'image') {
                img.src = '';
            } else if (i.data.thumbnail === 'nsfw') {
                img.src = nsfwImg;
            } else if (i.data.thumbnail === '' || i.data.crosspost_parent_list) {
                img.src = '';
            } else {
                img.src = i.data.url;
            };

            //DISPLAYS AND SNIPS SELFTEXT OF POST
            let prev = document.createElement('div');
            prev.className = 'preview';
            postCont.appendChild(prev);
            if (i.data.selftext.length > 200) {
                let snip = i.data.selftext.slice(0, 250);
                prev.innerHTML = snip.concat('...');
            } else if (i.data.crosspost_parent) {
                prev.innerHTML = i.data.crosspost_parent_list[0].selftext;
                if (i.data.crosspost_parent_list[0].selftext.length > 200) {
                    let cSnip = i.data.crosspost_parent_list[0].selftext.slice(0, 250);
                    prev.innerHTML = cSnip.concat('...');
                }
            } else {
                prev.innerHTML = i.data.selftext;
            }

            //APPENDS COMMENTS/UPVOTES TO BOTTOM OF POST
            let footer = document.createElement('div');
            footer.className = 'footer';
            postCont.appendChild(footer);
            let upvotes = i.data.ups;
            let downvotes = i.data.downs;
            let comments = i.data.num_comments;
            let score = i.data.score;
            let fLinks = document.createElement('a');
            fLinks.href = permalink;
            footer.appendChild(fLinks);
            fLinks.innerHTML = score + upvotes + ' ▲ ' + downvotes + ' ▼ ' + comments + ' comments';

        })
    };

    request('https://www.reddit.com/r/azurelane.json', callback);

    clearPage = () => {
        head.innerHTML = '';
        container.innerHTML = '';
    }

    randomSub = () => {
        url = randomSubreddits[Math.floor(Math.random() * 10)];
        clearPage();
        request(url, callback);
    }

    myBoard = () => {
        url = 'https://www.reddit.com/r/azurelane.json';
        clearPage();
        request(url, callback);
    }

    imgurFunc = () => {
        url = 'https://www.reddit.com/r/wholesomememes.json';
        clearPage();
        request(url, callback);

    }