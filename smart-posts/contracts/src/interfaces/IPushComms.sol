// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;


interface IPushCommsV2 {
    function subscribe(address _channel) external returns (bool);
}