import React from 'react';
import '../../styles/AnalyticsChart.css';

interface ChartData {
  label: string;
  value: number;
}

interface AnalyticsChartProps {
  data: ChartData[];
  type: 'bar' | 'donut';
  colors?: string[]; // optional override colors
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data, type, colors }) => {

  if (type === 'donut') {
    return (
      <div className="donut-chart">
        <div className="chart-container">
          <div className="donut-visual">
            {data.map((item, idx) => {
              const palette = colors || ['#0066cc', '#00cc99', '#ffb84d', '#ff6b6b'];
              return (
                <div
                  key={idx}
                  className="donut-segment"
                  style={{
                    backgroundColor: palette[idx],
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    opacity: item.value / 100
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="legend">
          {data.map((item, idx) => {
            const palette = colors || ['#0066cc', '#00cc99', '#ffb84d', '#ff6b6b'];
            return (
              <div key={idx} className="legend-item">
                <span className="color-box" style={{ backgroundColor: palette[idx] }} />
                <span>{item.label}: {item.value}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bar-chart">
      {data.map((item, idx) => {
        const palette = colors || ['#0066cc', '#00cc99', '#ffb84d', '#ff6b6b'];
        return (
          <div key={idx} className="bar-item">
            <div className="bar-label">{item.label}</div>
            <div className="bar-container">
              <div className="bar-fill" style={{ width: `${item.value}%`, backgroundColor: palette[idx] }} />
            </div>
            <div className="bar-value">{item.value}%</div>
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsChart;
