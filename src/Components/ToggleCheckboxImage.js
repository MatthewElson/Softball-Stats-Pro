function ToggleCheckboxImage({booleanValue, idx = -1}){
    const svgImageElement = idx > -1 ? document.querySelector(`svg.svgToSwap-${idx}.bi`) : document.querySelector(`svg.svgToSwap.bi`);
    let path = <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>;
    if(svgImageElement){
        if(booleanValue){
            svgImageElement.classList.add("bi-check-lg");
            svgImageElement.classList.remove("bi-x-lg");
            path = <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>;
        }
        else{
            if(svgImageElement) {
                svgImageElement.classList.add("bi-x-lg");
                svgImageElement.classList.remove("bi-check-lg");
            }
        }
    }
    return path;
}

export default ToggleCheckboxImage;
