import chroma from 'chroma-js';

function setArr() {
    Array.prototype.max = function() {
        return Math.max.apply(null, this);
    };
    
    Array.prototype.min = function() {
    return Math.min.apply(null, this);
    };
}  

export const heatmap = (prices) => {
    setArr()
    const scale = chroma.scale(['blue', 'green', 'yellow','red','red']).mode('lrgb').gamma(1)
    var priceChanges = []
    var colors = []
    for (let i = 0; i < prices.length; i++) {
        if(i===0) {priceChanges.push(0)}
        else {
            // console.log("prices",prices[i-1],prices[i])
            var priceChange = (prices[i]-prices[i-1])/prices[i-1]
            priceChanges.push(priceChange)
            // console.log("price change", priceChange)
        }        
    }
    var largestChange = priceChanges.max()
    var smallestChange = priceChanges.min()
    for (let i = 0; i < priceChanges.length; i++) {
        var x = (priceChanges[i] - smallestChange)/(largestChange - smallestChange)
        var color = scale(x).css()
        // console.log(x)
        colors.push(color) 
    }
    return colors
}