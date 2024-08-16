import React from 'react';
import NFTUploaderForm from '../components/nft-uploader-widget/';

const UploadPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload NFT Metadata</h1>
      <NFTUploaderForm />
    </div>
  );
};

export default UploadPage;