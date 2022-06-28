import { Line } from "react-chartjs-2";


// export const scales = {
//   x: {
//       type: 'time',

//   },
//   y: {
//     ticks: {
//       callback: function(value, index, values) {
//         if(parseInt(value) >= 1000){
//           return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//         } else {
//           return '$' + value;
//         }
//       }
//     }
//   }
// }
export const Chart = ({ chartData }) => {
  if(chartData[1]){
    var assetName = chartData[1].charAt(0).toUpperCase() + chartData[1].slice(1);
  }
    return (
        <div>
            <Line
            data={chartData[0]}
            options={{
              tooltips: {enabled: true},
              responsive: true,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
          
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                        }
                        return label;
                    }
                  }        
                },
                title: {
                  display: true,
                  text: `${assetName} ${chartData[2]} Week Moving Average Heatmap`
                },
                legend: {
                  display: false,
                  position: "bottom"
                },
              },
              scales: {
                y: {
                  type: 'logarithmic',
                  ticks: {
                    callback: function(value, index, values) {
                      if(parseInt(value) >= 1000){
                        return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                      } else {
                        return '$' + value;
                      }
                    }
                  }
                }
              }
            }}
            />
        </div>
    );
};