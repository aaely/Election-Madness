import React, { Component } from 'react';
import { PieChart, Pie, Legend, Sector, Cell } from 'recharts';

let COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

let renderActiveShape = (props) => {
    let RADIAN = Math.PI / 180;
    let {
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value,
    } = props;
    let sin = Math.sin(-RADIAN * midAngle);
    let cos = Math.cos(-RADIAN * midAngle);
    let sx = cx + (outerRadius + 10) * cos;
    let sy = cy + (outerRadius + 10) * sin;
    let mx = cx + (outerRadius + 30) * cos;
    let my = cy + (outerRadius + 30) * sin;
    let ex = mx + (cos >= 0 ? 1 : -1) * 22;
    let ey = my;
    let textAnchor = cos >= 0 ? 'start' : 'end';
  
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

class MyPieChart extends Component {

    constructor(props) {
        super(props);
            this.state = {
                bidenVotes: this.props.bidenVotes,
                trumpVotes: this.props.trumpVotes,
                joVotes: this.props.joVotes,
                totalVotes: this.props.totalVotes,
                activeIndex: 0
            }
        }

    onPieEnter = (data, index, e) => {
        this.setState({
          activeIndex: index,
        });
      };

    render() {
        const { bidenVotes, trumpVotes, joVotes } = this.state;
        let data = [
            { name: 'Joe Biden', value: parseInt(`${bidenVotes}`)},
            { name: 'Donald Trump', value: parseInt(`${trumpVotes}`)},
            { name: 'Jo Jorgensen', value: parseInt(`${joVotes}`)}
        ];
        console.log(data)
        return(
            <PieChart height={400} width={400} style={{margin: '0 auto'}}>
            <Pie
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx={200}
            cy={200}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
            onMouseEnter={this.onPieEnter}
            >
                {data.map((entry, index) => {
                    return (
                        <Cell key={`slice-${index}`} fill={COLORS[index % COLORS.length]}/> 
                    )})}
            </Pie>
            </PieChart>
        )
    }
}

export default MyPieChart;