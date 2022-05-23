pragma solidity 0.8.13;

interface IGauge {
    function notifyRewardAmount(address token, uint amount) external;
    function getReward(address account, address[] memory tokens) external;
    function claimFees() external returns (uint claimed0, uint claimed1);
    function deliverBribes() external;
    function addBribeRewardToken(address token) external;
    function left(address token) external view returns (uint);
    function setVoteStatus(address account, bool voted) external;
}
