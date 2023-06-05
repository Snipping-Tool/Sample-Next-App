/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    nftAPI: "https://1tlvtzvtsi.execute-api.ap-southeast-1.amazonaws.com/dev",
    minterAddress: "0xb5c03B72455BCBc13D3969c07db8218EF7aB8422",
    nftAddress: "0xD899f4c27fFf75655bb7709E556A6f0F3351d801",
    coinAddress: "0xa00d939Cf02956e262177bdc118A867931e62D25",
    dispenserAddress: "0x4eD792f6445caD11BFFDA7f9cB1938aB3E443F4C",
  },
};

module.exports = nextConfig;
