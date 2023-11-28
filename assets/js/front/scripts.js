jQuery(document).ready(function ($) {
    class SvgAnimateBlock {

        svg = null;
        params = {
            numCols: 4,
            numRows: 3,
            radius: 0,
            heightCoefficientBefore: [.6, .51, .45, .7],
            heightCoefficientHover: [.5, .5, .5, .5],
        };
        paramsGrid = [];

        constructor(svg) {
            this.svg = svg;
            this.svgImg = this.svg.querySelector('image');
            this.svgElements = this.svg.querySelectorAll('circle, rect');
            this.svgWrap = this.svg.closest('.hero__svg_wrap');
            this.listLinks = this.svg.parentNode.querySelector('.hero__anim_block_list_links');
            this.links = this.svg.parentNode.querySelectorAll('.hero__anim_block_item_link');

            this.init();
        }

        setParams(documentWidth = document.documentElement.clientWidth) {

            let imgUrl = '';
            let imgSize = '';

            if (documentWidth <= 980) {

                if (documentWidth <= 320) {
                    imgUrl = this.svgImg.dataset.img_href_2;
                    imgSize = this.svgImg.dataset.img_size_2.split(',');
                } else {
                    imgUrl = this.svgImg.dataset.img_href_1;
                    imgSize = this.svgImg.dataset.img_size_1.split(',');
                }

            } else {
                imgUrl = this.svgImg.dataset.img_href_0;
                imgSize = this.svgImg.dataset.img_size_0.split(',');
            }

            // Set Params Url Image
            this.svgImg.setAttribute('xlink:href', imgUrl);
            const ratio = imgSize[1] * 100 / imgSize[0];
            this.svgWrap.style.paddingBottom = ratio + '%';

            // Set Params Svg Size
            const svgBoundingClientRect = this.svg.getBoundingClientRect();
            this.params.svgWidth = svgBoundingClientRect.width;
            this.params.svgHeight = svgBoundingClientRect.height;

            // Set Params Middle Element
            this.params.middleElementHeight = this.params.svgHeight / 100 * 22.3; // 22.3%

            // Set Params Coefficient Height Cells
            this.params.heightCoefficient = this.params.heightCoefficientBefore;

            // Set Params Size Image
            this.svgImg.style.width = this.params.svgWidth;
            this.svgImg.style.height = this.params.svgHeight;

            // Set Params Gap
            if (documentWidth < 768) {
                this.params.widthGap = 7;
                this.params.heightGap = 8;
            } else {
                this.params.widthGap = this.params.svgWidth / 100 * 2.45; // 2.45%
                this.params.heightGap = this.params.svgWidth / 100 * 2.45; // 2.45%
            }

            // Set Params Radius Cells
            this.params.radius = parseInt(this.svg.dataset.cell_radius);
        }

        setParamsGrid() {

            this.paramsGrid.length = 0;

            const widthElement = (this.params.svgWidth - (this.params.numCols - 1) * this.params.widthGap) / this.params.numCols;
            const heightTopAndBottomElements = (this.params.svgHeight - (this.params.numRows - 1) * this.params.heightGap - this.params.middleElementHeight);

            const xi = [];
            for (let i = 0; i < this.params.numCols; i++) {
                xi.push((widthElement + this.params.widthGap) * i);
            }

            const parametersElements = [];
            for (let col = 0; col < this.params.numCols; col++) {
                for (let row = 0; row < this.params.numRows; row++) {

                    let heightTopElement = heightTopAndBottomElements * this.params.heightCoefficient[col];
                    if (heightTopElement < this.params.radius * 2) {
                        heightTopElement = this.params.radius * 2;
                    }
                    if (heightTopElement > heightTopAndBottomElements - this.params.radius * 2) {
                        heightTopElement = heightTopAndBottomElements - this.params.radius * 2;
                    }

                    const paramsElement = {
                        x: xi[col],
                        y: 0,
                        width: widthElement,
                        height: heightTopElement,
                        r: this.params.radius,
                    }

                    if (row === 1) {
                        paramsElement.y = heightTopElement + this.params.heightGap;
                        paramsElement.height = this.params.middleElementHeight;
                    }
                    if (row === 2) {
                        paramsElement.y = heightTopElement + this.params.middleElementHeight + this.params.heightGap * row;
                        paramsElement.height = heightTopAndBottomElements - heightTopElement;
                    }

                    this.paramsGrid.push(paramsElement);
                }
            }
        }

        getAttributesElement(args) {
            const {width, height, x, y, r: radius = 0} = args;

            return {
                circle: [
                    {r: radius, cx: x + radius, cy: y + radius},
                    {r: radius, cx: x + width - radius, cy: y + radius},
                    {r: radius, cx: x + width - radius, cy: y + height - radius},
                    {r: radius, cx: x + radius, cy: y + height - radius},
                ],
                rect: [
                    {x: x + radius, y: y, width: width - 2 * radius, height: height},
                    {x: x, y: y + radius, width: width, height: height - 2 * radius},
                ]
            }
        }

        setAttributeToSvgElements() {

            let numCell = -1;

            this.svgElements.forEach((el, i) => {

                if (this.params.radius === 0) {

                    const attrRect = this.paramsGrid[i];
                    el.setAttribute("x", attrRect.x + "px");
                    el.setAttribute("y", attrRect.y + "px");
                    el.setAttribute("width", attrRect.width + "px");
                    el.setAttribute("height", attrRect.height + "px");

                } else {

                    const numEl = i % 6;
                    const cell = (numEl === 0) ? ++numCell : numCell;
                    const paramsCell = this.paramsGrid[cell];
                    const attrElements = this.getAttributesElement(paramsCell);

                    if (el.localName === 'circle') {
                        const attrCircle = attrElements.circle[numEl];
                        el.setAttribute("r", attrCircle.r + "px");
                        el.setAttribute("cx", attrCircle.cx + "px");
                        el.setAttribute("cy", attrCircle.cy + "px");
                    } else {
                        const attrRect = attrElements.rect[numEl - 4];
                        el.setAttribute("x", attrRect.x + "px");
                        el.setAttribute("y", attrRect.y + "px");
                        el.setAttribute("width", attrRect.width + "px");
                        el.setAttribute("height", attrRect.height + "px");
                    }
                }
            });

            this.links.forEach((link, i) => {
                const params = this.paramsGrid[i === 0 ? 1 : 1 + i * 3];
                link.style.width = params.width + 'px';
                link.style.height = params.height + 'px';
                link.style.top = params.y + 'px';
                link.style.left = params.x + 'px';
                link.style.borderRadius = params.r + 'px';
            });
        }

        hover() {
            this.listLinks.addEventListener('mouseenter', () => {
                this.params.heightCoefficient = this.params.heightCoefficientHover;
                this.setParamsGrid();
                this.setAttributeToSvgElements();
            })

            this.listLinks.addEventListener('mouseleave', () => {
                this.params.heightCoefficient = this.params.heightCoefficientBefore;
                this.setParamsGrid();
                this.setAttributeToSvgElements();
            })
        }

        resize() {
            window.addEventListener("resize", () => {
                this.setParams(document.documentElement.clientWidth);
                this.setParamsGrid();
                this.setAttributeToSvgElements();
            });
        }

        appearanceAnim() {
            setTimeout(() => {
                this.svgElements.forEach((el, i) => {
                    el.style.opacity = 1;
                });

                this.links.forEach((el, i) => {
                    el.style.opacity = 1;
                });
            }, 100);

        }

        init() {
            if (!this.svg) return;

            this.setParams();
            this.setParamsGrid();

            this.setAttributeToSvgElements();
            this.hover();
            this.resize();

            this.appearanceAnim();
        }
    }


    document.querySelectorAll('[id ^= "svg_anim_block"]').forEach(svg => {
        new SvgAnimateBlock(svg);
    });

});