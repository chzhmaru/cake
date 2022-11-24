(()=>{
    // 스크롤 값
    let yOffset = 0;

    // 현재 보여지는 section
    let currentSection = 0;    


    let prevSectionHeight = 0;

    

    const sectionSet = [
        // section-0
        {
            type : 'normal',
            height : 0,
            multiple : 1.5,
            objs : {
                container : document.querySelector('#section-0'),
                openA : document.querySelector('#section-1 .opening.a'),
                openB : document.querySelector('#section-1 .opening.b'),
                mainCanvas : document.querySelector('#main-canvas'),
                canvasH1 : document.querySelector('#canvas-h1'),
                canvasP : document.querySelector('#canvas-p')
               

            },
            values : {



            }

        },

         // section-1
        {
            // type : section의 구분값 (sticky : 글자위치가 고정되어 스크롤에 반응하는 섹션)
            //                          normal : 일반적인 스크롤 섹션
            type : 'sticky',

            // height : 스크롤의 높이, 초기화함수에서 화면 구성에 따라 비율로 설정됨.
            height : 0,

            // multiple : 스크롤 높이를 설정하기 위한 배수.
            multiple : 2.5,

            // section에서 사용하는 element들을 저장.            
            objs : {
                container : document.querySelector('#section-1'),
                openA : document.querySelector('#section-1 .opening.a'),
                openB : document.querySelector('#section-1 .opening.b'),
                mainCanvas : document.querySelector('#main-canvas'),
                canvasH1 : document.querySelector('#canvas-h1'),
                canvasP : document.querySelector('#canvas-p')


            },
            // section에서 사용하는 값들을 저장.
            values : {
                //메세지 A의 불투명도를 0---->1까지 애니메이션을 하는데 (0 : 투명)
                //0.1(10%) 위치부터 0.2(20%) 위치까지 하겠다
                messageA_opacity_out    : [0, 1, {start: 0.1, end: 0.2}],
                messageA_translateY_out : [-20, 0, {start: 0.1, end: 0.2}],
                messageA_opacity_in     : [1, 0, {start: 0.2, end: 0.3}],
                messageA_translateY_in  : [0, 20, {start: 0.2, end: 0.3}],

                messageB_opacity_out    : [0, 1, {start: 0.4, end: 0.5}],
                messageB_translateY_out : [-20, 0, {start: 0.4, end: 0.5}],
                messageB_opacity_in     : [1, 0, {start: 0.5, end: 0.6}],
                messageB_translateY_in  : [0, 20, {start: 0.5, end: 0.6}],

                messageC_opacity_out    : [0, 1, {start: 0.7, end: 0.8}],
                messageC_translateY_out : [-20, 0, {start: 0.7, end: 0.8}],
                messageC_opacity_in     : [1, 0, {start: 0.8, end: 0.9}],
                messageC_translateY_in  : [0, -20, {start: 0.8, end: 0.9}],
            } 

        },


        
        // section-2
        {
            type : 'sticky',
            height : 0,
            multiple : 5,            
            objs : {
                container : document.querySelector('#section-2'),
                mainCanvas : document.querySelector('#main-canvas'),
                canvasH1 : document.querySelector('#canvas-h1'),
                canvasP : document.querySelector('#canvas-p'),
                context : document.querySelector('#main-canvas').getContext('2d'),
                canvasImages : []

            },
            values : {
                imageCount : 630,
                imageSequence : [0, 630],

            }
        

        } 

        
        
        
    ];

//-------------------------------------------------------------------------
// 함수 파트
//-------------------------------------------------------------------------
   
    // sectionSet 배열을 초기화 해주는 함수.
    const initSectionSet = function()
    {
        // 높이를 설정.
        for(let i = 0; i < sectionSet.length; i++)
        {
            // 높이를 설정한다.
            sectionSet[i].height = window.innerHeight * sectionSet[i].multiple;      
            //console.log(sectionSet[i].height+"   /  "+window.innerHeight +"  /  "+sectionSet[i].multiple )                 
            sectionSet[i].objs.container.style.height = `${sectionSet[i].height}px`;

        }

        // 이미지를 불러온다.
        let elmImage = null;
        for (let i = 0; i < sectionSet[2].values.imageCount; i++)
        {
            elmImage = new Image();
            elmImage.src = `./capture/cake_${i}.jpg`;
           
            sectionSet[2].objs.canvasImages.push(elmImage);
        }

    }    

    // yOffset에 따라 현재 보고있는 Section을 설정한다.
    // 스크롤이 일어날때 실행되어야 한다.
    const getCurrentSection = function()
    {        
        let result = 0;

        if (yOffset <= sectionSet[0].height)
        {
            result = 0;

        }
        else if ((yOffset > sectionSet[0].height) &&
                 (yOffset <= sectionSet[0].height + sectionSet[1].height))
        {
            result = 1;
           
        }
        else if (yOffset > sectionSet[0].height + sectionSet[1].height)
        {
            result = 2;
        }

        return result;
       
    }

    // 현재 section의 위쪽 section의 높이 합을 구한다.
    const getPrevSectionHeight = function()
    {
        let result = 0;

        for (let i = 0; i < currentSection; i++)
        {
            result = result + sectionSet[i].height;

        }

        return result;
    }

    // 최초에 HTML Page를 초기화하는 함수.
    const initHTMLPage = function()
    {
        // sectionSet을 초기화한다.
        initSectionSet();

    }

    const calcValue = function(values)
    {
       
        let result = 0;
        let rate = 0;
       
        let partStart = 0;      // start의 offset값
        let partEnd = 0;        // end의 offset값.
        let partHeight = 0;

        const range = values[1] - values[0];
        const sectionHeight = sectionSet[currentSection].height;



        if (values.length === 3)
        {
            partStart = sectionHeight * values[2].start;
            partEnd = sectionHeight * values[2].end;
            partHeight = partEnd - partStart;
            //console.log("partEnd : "+partEnd +" / partStart : "+partStart);
            //console.log("partHeight : "+partHeight);

            if ((sectionYOffset >= partStart) && (sectionYOffset <= partEnd))
            {
                //1. 비율
                rate = (sectionYOffset - partStart) / partHeight;
                result = (rate * range) + values[0];              

            }
            else if (sectionYOffset < partStart)
            {
                result = values[0];

            }
            else if (sectionYOffset > partEnd)
            {
                result = values[1];

            }
           
        }
        else
        {
            rate = sectionYOffset / sectionHeight;
            result = (range * rate) + values[0];
     
        }

        return result;

    }


    const playAnimation = function()
    {

        let opacityValue = 0;
        let translateValue = 0;
        let imageIndex = 0;
        const cs = sectionSet[currentSection];

        const offsetRate = sectionYOffset / cs.height;


        //console.log(currentSection +" / "+offsetRate)
        switch(currentSection)
        {
            case 0 :      
            sectionSet[currentSection].objs.mainCanvas.style.opacity = `0`
            sectionSet[currentSection].objs.canvasH1.style.opacity = `0`
            sectionSet[currentSection].objs.canvasP.style.opacity = `0`
            sectionSet[currentSection].objs.openA.style.opacity = `0`
            sectionSet[currentSection].objs.openB.style.opacity = `0`
                
               
                break;

            case 1 :

                if (offsetRate < 0.1)
                {
                    sectionSet[currentSection].objs.mainCanvas.style.opacity = `0`
                    sectionSet[currentSection].objs.canvasH1.style.opacity = `0`
                    sectionSet[currentSection].objs.canvasP.style.opacity = `0`
                    sectionSet[currentSection].objs.mainCanvas.style.opacity = `0`
                    sectionSet[currentSection].objs.openA.style.opacity = `0`
                    sectionSet[currentSection].objs.openB.style.opacity = `0`
    
                    console.log('offset-zone 0');
                }
                else if((offsetRate > 0.1) && (offsetRate <= 0.2))
                {
                    opacityValue = calcValue(sectionSet[currentSection].values.messageA_opacity_out);
                    sectionSet[currentSection].objs.openA.style.opacity = `${opacityValue}`;
    
                    translateValue = calcValue(sectionSet[currentSection].values.messageA_translateY_out);
                    sectionSet[currentSection].objs.openA.style.transform = `TranslateY(${translateValue}%)`;
    
                    sectionSet[currentSection].objs.mainCanvas.style.opacity = `0`
                    sectionSet[currentSection].objs.canvasH1.style.opacity = `0`
                    sectionSet[currentSection].objs.canvasP.style.opacity = `0`
                    sectionSet[currentSection].objs.openB.style.opacity = `0`
                    console.log('offset-zone 1');
                }
    
                else if ((offsetRate > 0.2) && (offsetRate <= 0.3))
                {
                    opacityValue = calcValue(sectionSet[currentSection].values.messageA_opacity_in);
                    sectionSet[currentSection].objs.openA.style.opacity = `${opacityValue}`;
    
                    translateValue = calcValue(sectionSet[currentSection].values.messageA_translateY_in);
                    sectionSet[currentSection].objs.openA.style.transform = `TranslateY(${translateValue}%)`;
    
                    sectionSet[currentSection].objs.mainCanvas.style.opacity = `0`
                    sectionSet[currentSection].objs.canvasH1.style.opacity = `0`
                    sectionSet[currentSection].objs.canvasP.style.opacity = `0`
                    sectionSet[currentSection].objs.openB.style.opacity = `0`
                    console.log('offset-zone 2');
                }   
    
                else if((offsetRate > 0.3) && (offsetRate < 0.4))
                {
                    sectionSet[currentSection].objs.mainCanvas.style.opacity = `0`
                    sectionSet[currentSection].objs.canvasH1.style.opacity = `0`
                    sectionSet[currentSection].objs.canvasP.style.opacity = `0`
                    sectionSet[currentSection].objs.openA.style.opacity = `0`
                    sectionSet[currentSection].objs.openB.style.opacity = `0`
                    console.log('offset-zone 2.5');
                }
    
                else if((offsetRate >= 0.4) && (offsetRate <= 0.5))
                {
                    opacityValue = calcValue(sectionSet[currentSection].values.messageB_opacity_out);
                    sectionSet[currentSection].objs.openB.style.opacity = `${opacityValue}`;
    
                    translateValue = calcValue(sectionSet[currentSection].values.messageB_translateY_out);
                    sectionSet[currentSection].objs.openB.style.transform = `TranslateY(${translateValue}%)`;
    
                    sectionSet[currentSection].objs.mainCanvas.style.opacity = `0`
                    sectionSet[currentSection].objs.canvasH1.style.opacity = `0`
                    sectionSet[currentSection].objs.canvasP.style.opacity = `0`
                    sectionSet[currentSection].objs.openA.style.opacity = `0`
                    console.log('offset-zone 3');
                }
    
                else if ((offsetRate > 0.5) && (offsetRate <= 0.6))
                {
                    opacityValue = calcValue(sectionSet[currentSection].values.messageB_opacity_in);
                    sectionSet[currentSection].objs.openB.style.opacity = `${opacityValue}`;
    
                    translateValue = calcValue(sectionSet[currentSection].values.messageB_translateY_in);
                    sectionSet[currentSection].objs.openB.style.transform = `TranslateY(${translateValue}%)`;
    
                    sectionSet[currentSection].objs.mainCanvas.style.opacity = `0`
                    sectionSet[currentSection].objs.canvasH1.style.opacity = `0`
                    sectionSet[currentSection].objs.canvasP.style.opacity = `0`
                    sectionSet[currentSection].objs.openA.style.opacity = `0`
                    console.log('offset-zone 4');
                }
    
                else if ((offsetRate > 0.6) && (offsetRate < 0.7))
                {
                    sectionSet[currentSection].objs.mainCanvas.style.opacity = `0`
                    sectionSet[currentSection].objs.canvasH1.style.opacity = `0`
                    sectionSet[currentSection].objs.canvasP.style.opacity = `0`
                    sectionSet[currentSection].objs.openA.style.opacity = `0`
                    sectionSet[currentSection].objs.openB.style.opacity = `0`
                    console.log('offset-zone 4.5');
                }
    
    
                else
                {
                    sectionSet[currentSection].objs.mainCanvas.style.opacity = `0`
                    sectionSet[currentSection].objs.canvasH1.style.opacity = `0`
                    sectionSet[currentSection].objs.canvasP.style.opacity = `0`
                    sectionSet[currentSection].objs.openA.style.opacity = `0`
                    sectionSet[currentSection].objs.openB.style.opacity = `0`
    
                    console.log('offset-zone 7');
                }
               
                break;
   
        
            case 2 :
                 // 이미지 인덱스 0~400까지 나오는게 목표.
                //[0, 400]

                sectionSet[currentSection].objs.mainCanvas.style.opacity = `1`
                sectionSet[currentSection].objs.canvasH1.style.opacity = `1`
                sectionSet[currentSection].objs.canvasP.style.opacity = `1`
                imageIndex = Math.round(calcValue(cs.values.imageSequence));
                cs.objs.context.drawImage(cs.objs.canvasImages[imageIndex], 0, 0);


               
                break;
        
   
        }
   
    }

   



    // 스크롤시에 수행되는 함수
    const scrollLoop = function()
    {  
        // currentSection에 따른 CSS값을 설정.
        document.body.setAttribute('id', `show-section-${currentSection}`);

        // 해당 currentSection에서 실행할 애니메이션을 돌린다.
        playAnimation();
       
    }


   

//-------------------------------------------------------------------------
// 이벤트 핸들러
//-------------------------------------------------------------------------



    window.addEventListener('scroll', ()=>{

        // 스크롤값(yOffset),
        // 현재 섹션 (currentSection)
        // 이전섹션의높이(prevSectionHeight)
        // 현재 섹션내에서의 스크롤값(sectionYOffset)
        yOffset             = window.scrollY;
        currentSection      = getCurrentSection();                    
        prevSectionHeight   = getPrevSectionHeight();
        sectionYOffset      = yOffset - prevSectionHeight;
 


        
        scrollLoop();

    });



   

//-------------------------------------------------------------------------
// 함수 호출
//-------------------------------------------------------------------------
    initHTMLPage();


})();