import React, { useEffect, useState, useRef } from "react";
import { Chart } from "./Chart";
// import { movingAvg } from "./movingAverage";
import './index.css';
import { heatmap } from "./setHeatmap";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

const calculateItemsSum = (data, start, stop) => {
	let sum = 0;
  	for (let j = start; j < stop; ++j) {
      	sum += data[j];
    }
  	return sum;
};

const movingAvg = (data, window) => {
    const steps = data.length - window;
	const result = [ ];
    for (let i = 0; i < steps; ++i) {
        const sum = calculateItemsSum(data, i, i + window);
        result.push(sum / window);
    }
  	return result;
};

function Data(props) {
  const [hasError, setHasError] = useState(false);
  var asset = props.asset.toLowerCase()
  console.log(props)
  useEffect(() => {
    const fetchPrices = async () => {
      setHasError(false);
      try {
        var res = await fetch("https://api.coingecko.com/api/v3/coins/"+asset+"/market_chart?vs_currency=usd&days=max")
      var data = await res.json()
      var prices = data.prices.map((point)=>point[1])
      var WEEKS;
      var granularity = 30;
      if (prices.length>3000) {
        WEEKS = 200
      } else if(prices.length>1750 && prices.length<=3000) {
        WEEKS = 100
      } else if(prices.length>875 && prices.length<=1750) {
        WEEKS = 50
        granularity = 7
      } else {
        WEEKS = 25
        granularity = 7
      }
      var DAYS = WEEKS * 7
      // WEEKS = prices.length/20
      // DAYS = WEEKS * 7
      var monthlyData = data.prices.filter((ele, index)=>{return (index % granularity === 0) && (index > DAYS)})
      var dates = data.prices.map((point)=> 
        (new Date(point[0]))
        .toLocaleDateString("en-US")
      )
      var monthlyFormatted = monthlyData.map(function(point) {
        var y = point[1]
        var x = (new Date(point[0])).toLocaleDateString("en-US")
        return {x: x, y: y}
      })
      var wmaDates = dates.slice(DAYS, dates.length)
      var wmaPrices = prices.slice(DAYS,prices.length)
      console.log(prices)
      var wma = movingAvg(prices, DAYS)
      console.log(wma)
      // wma = wma.slice(DAYS,wma.length)
      var wmaMonthlyPrices = wma.filter((ele,index)=>{ return (index % granularity === 0)})
      setChartData([{
        labels: wmaDates,
        datasets: [
          {
            label: "Price",
            fill: false,
            borderColor: 'rgba(0, 0, 0, .5)',
            backgroundColor: 'rgba(0, 0, 0,.3)',
            borderWidth: 1,
            pointRadius: 0,
            pointBackgroundColor:'rgba(0, 0, 0,.3)' ,
            data: wmaPrices,
            // pointBackgroundColor: heatmap(wmaPrices)
          },
          {
            label: "200 Weekly Moving Average",
            // fill: true,
            borderColor: 'rgba(250, 50, 50, .5)',
            backgroundColor: 'rgba(0, 0, 0,.3)',
            borderWidth: 3,
            pointRadius: 0,
            pointBackgroundColor:'rgba(0, 0, 0,.3)' ,
            data: wma     
          },
          {
            // fill: true,
            borderColor: 'rgba(250, 50, 50, .5)',
            backgroundColor: 'rgba(0, 0, 0,.3)',
            borderWidth: 0,
            pointRadius: 7,
            pointBackgroundColor: heatmap(wmaMonthlyPrices).slice(4,wmaMonthlyPrices.length) ,
            data: monthlyFormatted.slice(4,monthlyFormatted.length)    
          },
        ]
      }, asset, WEEKS])
      
      } catch (error) {
        setHasError(true);
      }
    }
    fetchPrices()
  }, [asset]);
  const [chartData, setChartData] = useState({}) 
  return (
    <React.Fragment>
      {hasError && <Alert key='dark' variant='dark'>Error: incorrect asset name.</Alert>}
      <Chart chartData={chartData}/>
    </React.Fragment>
  );
}

export default function App() {
  const [asset, submitAsset] = useState('bitcoin')
  const ref = useRef(null);
  const onFormSubmit = e => {
    e.preventDefault()
    submitAsset(e.target[0].value)
    const secondChart = ref.current;
    console.log(asset)
  }
  return (
    <div className="app">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href="">Heatmaps</Navbar.Brand>
          <Form onSubmit={onFormSubmit} className="d-flex">
              <Form.Control
                // onChange={onInput} 
                // value={asset}
                name="search"
                type="search"
                placeholder="Search Coins..."
                className="me-2"
                aria-label="Search"
              />
              <Button type = "submit" className="search">Search</Button>
          </Form>
        </Container>
      </Navbar>
      <Row className="justify-content-md-center chart">
        <Col xs lg="7">
          <Data className="first-graph" asset={asset}/>
          <br></br>
          <br></br>
          <Card bg='dark' text='white'>
            <Card.Body>
            <Card.Title>About Heatmaps</Card.Title>
            <Card.Text className="about">
            <p>
            In each of its major market cycles, Bitcoin's price historically bottoms out around the 200 week moving average.
            </p>

            <p>
            This indicator uses a color heatmap based on the % increases of the 200 week moving average.
            Depending on the month-by-month % increase of the 200 week moving average, a colour is assigned to the price chart.
            </p>
            <hr></hr>
            <b><p>
            While this chart is extremely useful for investing in Bitcoin, it remains unavailable for much of the other cryptocurrencies. Though other coins lack the history for a 200 WMA to be meaningful, we believe that by basing the size of the WMA on the age of the cryptocurrency, this indicator remains useful for other coins.
            </p></b>

            </Card.Text>
            </Card.Body>
          </Card>
          <br></br>
          <br></br>
          <Data ref={ref} asset='ethereum'/>
        </Col>
      </Row>
    </div>
  )
}