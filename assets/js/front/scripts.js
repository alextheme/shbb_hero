jQuery(document).ready(function ($) {
    class ListBlock {

        block = null;
        params = {
            heightCoefficient: [],
            heightCoefficientInit: [],
            heightCoefficientHover: [],
        };

        constructor(block) {
            if (!block) return;

            this.block = block;

            this.params.radius = parseFloat(this.block.dataset.radius);

            this.params.heightCoefficientInit = this.block.dataset.h_top_elements
                .split(',')
                .map(el => {
                    const num = parseInt(el);
                    return isNaN(num) ? Math.random() * 100 : Math.abs(num);
                });

            // Set Params Coefficient Height Cells
            this.params.heightCoefficient = this.params.heightCoefficientInit;
            this.params.heightCoefficientHover = this.params.heightCoefficientInit.map(() => 50);

            this.params.ratio = [...this.block.dataset.ratio
                .split(',')
                .map(el => {
                    const num = parseInt(el);
                    return isNaN(num) ? 100 : Math.abs(num);
                }), 100, 100, 100];

            this.init();
        }

        setParams(docWidth = document.documentElement.clientWidth) {
            const wrap = this.block.querySelector('.listblock__wrapper');
            if (wrap) {
                let ratio = this.params.ratio[0];

                if (docWidth < 1200) {
                    if (docWidth > 768) {
                        ratio = this.params.ratio[1];
                    } else {
                        ratio = this.params.ratio[2];
                    }
                }
                wrap.style.paddingBottom = ratio + '%';
            }

            this.params.heightBlock = this.block.getBoundingClientRect().height;
            this.params.widthBlock = this.block.getBoundingClientRect().width;

            this.params.gapRow = this.params.widthBlock / 100 * parseFloat(this.block.dataset.gap);

            // Set Params Middle Element
            this.params.heightMiddleElement = this.params.heightBlock / 100 * parseFloat(this.block.dataset.h_middle); // 22.3%
        }

        getAttributesElements(element, index) {
            const heightTopBottomElements = this.params.heightBlock - this.params.heightMiddleElement - this.params.gapRow * 2;

            let heightTop = heightTopBottomElements / 100 * this.params.heightCoefficient[index];

            console.log(this.params)
            if (heightTop < this.params.radius * 2) {
                heightTop = this.params.radius * 2;
            }
            if (heightTop > heightTopBottomElements - this.params.radius * 2) {
                heightTop = heightTopBottomElements - this.params.radius * 2;
            }

            return {
                width: element.getBoundingClientRect().width,
                heightTop: heightTop,
                heightMiddle: this.params.heightMiddleElement,
                heightBottom: heightTopBottomElements - heightTop,
                y_middle: heightTop + this.params.gapRow,
                y_bottom: heightTop + this.params.heightMiddleElement + this.params.gapRow * 2,
            }
        }

        setAttributeToMask() {

            this.block.querySelectorAll('.listblock__list .listblock__item').forEach((el, i, all) => {
                const { width, heightTop, heightMiddle, heightBottom,
                    y_middle, y_bottom} = this.getAttributesElements(el, i);

                // Set Attribute Link
                const link = el.querySelector('a');
                link.style.top = y_middle + 'px';
                link.style.height = heightMiddle + 'px';

                el.querySelectorAll('rect').forEach((rect, i) => {
                    rect.setAttribute("width", width);

                    if (i === 0) {
                        rect.setAttribute("height", heightTop);
                    }

                    if (i === 1) {
                        rect.setAttribute("height", heightMiddle);
                        rect.setAttribute("y", y_middle);
                    }

                    if (i === 2) {
                        rect.setAttribute("height", heightBottom);
                        rect.setAttribute("y", y_bottom);
                    }
                });
            });
        }

        hover() {
            this.block.addEventListener('mouseenter', () => {
                this.params.heightCoefficient = this.params.heightCoefficientHover;
                this.setAttributeToMask();
            })

            this.block.addEventListener('mouseleave', () => {
                this.params.heightCoefficient = this.params.heightCoefficientInit;
                this.setAttributeToMask();
            })
        }

        resize() {
            window.addEventListener("resize", () => {
                this.setParams(document.documentElement.clientWidth);
                this.setAttributeToMask();
            });
        }

        appearanceAnim() {
            setTimeout(() => {
                this.block.style.opacity = 1;
            }, 100);

        }

        init() {
            if (!this.block) return;

            this.setParams();
            this.setAttributeToMask();
            this.hover();
            this.resize();
            this.appearanceAnim();
        }
    }


    document.querySelectorAll('[id ^= "listblock_"]').forEach(svg => {
        new ListBlock(svg);
    });

});