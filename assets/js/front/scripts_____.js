jQuery(document).ready(function ($) {

    const svgAnimBlock = $('.svg_anim_block');

    const params = {}

    function setParams(documentWidth = document.documentElement.clientWidth) {

        params.widthBlock = svgAnimBlock.width();
        params.heightBlock = svgAnimBlock.height();
        params.numCols = 4;
        params.numRows = 3;
        params.heightCoefficient = [.6, .51, .45, .7];

        const svgImg$ = $('[id^="#svg_image_bg"]');

        if (documentWidth < 980) {
            params.widthBlock = documentWidth;
            params.heightBlock = documentWidth * 0.93;

            if (documentWidth < 320) {
                svgImg$.attr('xlink:href', svgImg$.attr('data-href_2'));
            } else {
                svgImg$.attr('xlink:href', svgImg$.attr('data-href_1'));
            }

        } else {
            svgImg$.attr('xlink:href', svgImg$.attr('data-href_0'))
        }

        svgImg$.css({
            width: params.widthBlock,
            height: params.heightBlock,
        });

        if (documentWidth < 768) {
            params.widthGap = 7;
            params.heightGap = 8;
            params.heightMiddleElement = 60;
        } else {
            params.widthGap = 20;
            params.heightGap = 20;

            if (documentWidth < 1280) {
                params.heightMiddleElement = 80;
            } else {
                params.heightMiddleElement = 140;
            }
        }
    }

    function setParamsHover(mouseover = true) {
        if (mouseover) {
            params.heightCoefficient = [.5, .5, .5, .5];
        } else {
            params.heightCoefficient = [.6, .51, .45, .7];
        }
    }

    function getAttributesElement(args) {
        const {width, height, x, y, r: radius = 0} = args;

        return {
            circle: [
                {r: radius, cx: x + radius, cy: y + radius},
                {r: radius, cx: x + width - radius, cy: y + radius},
                {r: radius, cx: x + width - radius, cy: y + height - radius},
                {r: radius, cx: x + radius, cy: y + height - radius},
            ],
            rect: [
                {x: x + radius, y: y, w: width - 2 * radius, h: height},
                {x: x, y: y + radius, w: width, h: height - 2 * radius},
            ]
        }
    }

    function getParametersGrid(args) {
        const {
            widthBlock,
            heightBlock,
            widthGap,
            heightGap,
            numCols,
            numRows,
            heightMiddleElement,
            heightCoefficient = [.5, .5, .5, .5],
            radius,
        } = args;

        const widthElement = (widthBlock - (numCols - 1) * widthGap) / numCols;
        const heightTopAndBottomElements = (heightBlock - (numRows - 1) * heightGap - heightMiddleElement);

        const xi = [];
        for (let i = 0; i < numCols; i++) {
            xi.push((widthElement + widthGap) * i);
        }

        const parametersElements = [];
        for (let col = 0; col < numCols; col++) {
            for (let row = 0; row < numRows; row++) {

                let heightTopElement = heightTopAndBottomElements * heightCoefficient[col];
                if (heightTopElement < radius * 2) {
                    heightTopElement = radius * 2;
                }
                if (heightTopElement > heightTopAndBottomElements - radius * 2) {
                    heightTopElement = heightTopAndBottomElements - radius * 2;
                }

                const paramsElement = {
                    x: xi[col],
                    y: 0,
                    width: widthElement,
                    height: heightTopElement,
                    r: radius,
                }

                if (row === 1) {
                    paramsElement.y = heightTopElement + heightGap;
                    paramsElement.height = heightMiddleElement;
                }
                if (row === 2) {
                    paramsElement.y = heightTopElement + heightMiddleElement + heightGap * row;
                    paramsElement.height = heightTopAndBottomElements - heightTopElement;
                }

                parametersElements.push(paramsElement);
            }
        }

        return parametersElements;
    }

    function setAttributeToHtmlElements() {
        const parametersGrid = getParametersGrid(params);
        const htmlElements = $('#svgmask1 circle, #svgmask1 rect');

        let numCell = -1;

        htmlElements.each((i, el) => {

            const numEl = i % 6;

            if (i % 6 === 0) {
                numCell++;
            }

            const parametersCell = parametersGrid[numCell];
            const attrElements = getAttributesElement(parametersCell);

            if (el.localName === 'circle') {
                const attrCircle = attrElements.circle[numEl];
                el.setAttribute("r", attrCircle.r + "px");
                el.setAttribute("cx", attrCircle.cx + "px");
                el.setAttribute("cy", attrCircle.cy + "px");
            } else {
                const attrRect = attrElements.rect[numEl - 4];
                el.setAttribute("x", attrRect.x + "px");
                el.setAttribute("y", attrRect.y + "px");
                el.setAttribute("width", attrRect.w + "px");
                el.setAttribute("height", attrRect.h + "px");
            }
        });

        $('.hero__anim_block_item_link').each((i, link) => {
            const params = parametersGrid[i === 0 ? 1 : 1 + i * 3];
            $(link).width(params.width + 'px');
            $(link).height(params.height + 'px');
            $(link).css({
                "top": params.y + 'px',
                'left': params.x + 'px',
                'border-radius': params.r + 'px',
            });
        });
    }

    function start() {
        setParams();
        setAttributeToHtmlElements();
        const links$ = $('.hero__anim_block_list_links');

        links$.on('mouseenter', function (e) {
            setParamsHover();
            setAttributeToHtmlElements();
        })

        links$.on('mouseleave', function (e) {
            setParamsHover(false);
            setAttributeToHtmlElements();
        })

        window.addEventListener("resize", function (event) {
            setParams(document.documentElement.clientWidth);
            setAttributeToHtmlElements();
        });
    }

    start();

});