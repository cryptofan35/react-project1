import React from "react";
import { Card } from "antd";

const PropertyAddCard = ({ img, title, content, renderContent }) => {
  return (
    <Card>
      <div style={{ padding: 20 }}>
        <div className="card-image">{img}</div>
        <div className="card-title">{title}</div>
        <div className="card-content">
          {renderContent ? renderContent() : content}
        </div>
      </div>
    </Card>
  );
};

export default PropertyAddCard;
