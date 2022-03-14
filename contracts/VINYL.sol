// SPDX-License-Identifier: MIT
/*
 ___  ___  _ _  _ _  ___  __ __  _  _ _  ___  
/ __>| . || | || \ || . \|  \  \| || \ ||_ _| 
\__ \| | || ' ||   || | ||     || ||   | | |  
<___/`___'`___'|_\_||___/|_|_|_||_||_\_| |_|  .

                    ___                                          ___
 __________________/  /                       __________________/  /
| _    _______    /  /                       | _    _______    /  /
|(_) .d########b. //)| _____________________ |(_) .d########b. //)|
|  .d############//  ||        _____        ||  .d############//  |
| .d######""####//b. ||() ||  [     ]  || ()|| .d######""####//b. |
| 9######(  )#_//##P ||()|__|  | = |  |__|()|| 9######(  )#_//##P |
| 'b######++#/_/##d' ||() ||   | = |   || ()|| 'b######++#/_/##d' |
|  "9############P"  ||   ||   |___|   ||   ||  "9############P"  |
|  _"9a#######aP"    ||  _   _____..__   _  ||  _"9a#######aP"    |
| |_|  `""""''       || (_) |_____||__| (_) || |_|  `""""''       |
|  ___..___________  ||_____________________||  ___..___________  |
| |___||___________| |                       | |___||___________| |
|____________________|    SoundMint Vinyl    |____________________|
*/
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./subContracts/ERC1155PackedBalance.sol";

contract VINYL is ERC1155PackedBalance, Ownable, ReentrancyGuard {
    using Address for address;
    using Strings for uint256;
    using SafeMath for uint256;

    string private baseURI;
    
    bool public isActive = false;

    bytes32 public merkleRoot = 0xb6988e0a864d0384016113cbbd82753e7094a8476d74bf7e13a9e28e80a15424;

    mapping (uint256 => uint256) _redeemed;

    uint8 public constant MINT_VINYL = 0;
    uint8 public constant GOLD_VINYL = 1;
    uint8 public constant ONYX_VINYL = 2;
    
    /*
     * Function to mint NFTs (internal)
    */
    function mint(address to, uint mint_type) internal {
        uint[] memory Collect = new uint[](2);
        uint[] memory Count = new uint[](2);
        
        if (mint_type == 1){
            _mint(to, MINT_VINYL, 1, "");
        } else if (mint_type == 2){
            _mint(to, MINT_VINYL, 2, "");
        } else if (mint_type == 3){
            Collect[0] = MINT_VINYL;
            Collect[1] = GOLD_VINYL;
            Count[0] = 2;
            Count[1] = 1;
            _batchMint(to, Collect, Count, "");
        } else if (mint_type == 4) {
            Collect[0] = MINT_VINYL;
            Collect[1] = GOLD_VINYL;
            Count[0] = 4;
            Count[1] = 2;
            _batchMint(to, Collect, Count, "");
        } else if (mint_type == 5) {
            _mint(to, ONYX_VINYL, 1, "");
        }
    }
    /*
     * Function to burn NFTs (public)
    */
    function burn(uint _id, uint amount) public nonReentrant{
       _burn(msg.sender, _id, amount);
    }
    /*
     * Function toggleActive to activate/desactivate the smart contract
    */
    function toggleActive() public onlyOwner {
        isActive = !isActive;
    }

    /*
     * Function to set Base URI
    */
    function setURI(string memory _URI) public onlyOwner {
        baseURI = _URI;
    }

    /*
     * Function to set the merkle root
    */
    function setMerkleRoot(bytes32 merkleRootHash) public onlyOwner {
        merkleRoot = merkleRootHash;
    }

    function checkDoubleMint(uint256 index) public view returns (bool){
      uint256 redeemedBlock = _redeemed[index / 256];
      uint256 redeemedMask = (uint256(1) << uint256(index % 256));
      if ((redeemedBlock & redeemedMask) != 0) return false; 
      return true;
    }

    function setMintRedeem(uint256 index) internal{
      uint256 redeemedBlock = _redeemed[index / 256];
      uint256 redeemedMask = (uint256(1) << uint256(index % 256));
      _redeemed[index / 256] = redeemedBlock | redeemedMask;
    }
    /*
     * Function to mint new NFTs during presale/raffle
    */
    function mintNFT(uint256 index, uint256 mint_type, bytes32[] memory _proof) public nonReentrant{
        require(isActive, 'Contract is not active');
        // To prevent several mint
        require(checkDoubleMint(index) == true, "MerkleDrop: drop already claimed");

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, mint_type, index));
        require(verify(merkleRoot, _proof, leaf), "Not whitelisted");
        
        setMintRedeem(index);
        mint(msg.sender, mint_type);
        
    }

    /*
     * Function to get token URI of given token ID
     * URI will be blank untill totalSupply reaches MAX_NFT_PUBLIC
    */
    function uri(uint256 _tokenId) public view returns (string memory) {
        return string(abi.encodePacked(baseURI, _tokenId.toString(), ".json"));
    }

    /*
     * Function to verify the Merkle Tree Proof
    */
    function verify(
        bytes32 root,
        bytes32[] memory proof,
        bytes32 leaf
    ) public pure returns (bool) {
        bytes32 hash = leaf;

        for (uint i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (hash <= proofElement) {
                // Hash(current computed hash + current element of the proof)
                hash = keccak256(abi.encodePacked(hash, proofElement));
            } else {
                // Hash(current element of the proof + current computed hash)
                hash = keccak256(abi.encodePacked(proofElement, hash));
            }            
        }

        return hash == root;
    }
}
