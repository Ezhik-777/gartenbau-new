import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import './BeforeAfterSlider.css';

interface Props {
  beforeImage: string;
  beforeAlt: string;
  afterImage: string;
  afterAlt: string;
  title?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
  title
}: Props) {
  return (
    <div className="before-after-container">
      {title && <h3 className="before-after-title">{title}</h3>}
      <div className="before-after-wrapper">
        <ReactCompareSlider
          itemOne={<ReactCompareSliderImage src={beforeImage} alt={beforeAlt} />}
          itemTwo={<ReactCompareSliderImage src={afterImage} alt={afterAlt} />}
          position={50}
          style={{
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}
        />
        <div className="before-after-labels">
          <span className="label-before">Vorher</span>
          <span className="label-after">Nachher</span>
        </div>
      </div>
    </div>
  );
}
