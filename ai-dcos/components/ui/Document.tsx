import React from 'react';

function Document({
  id,
  name,
  size,
  downloadUrl,
}: {
  id: string;
  name: string;
  size: number;
  downloadUrl: string;
}) {
  return <div>Document</div>;
}

export default Document;
