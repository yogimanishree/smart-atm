// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    string[] public goals; // Array to store goals

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event GoalAdded(string goal);
    event GoalRemoved(string goal);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        balance += _amount;
        assert(balance == _previousBalance + _amount);
        emit Deposit(_amount);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }
        balance -= _withdrawAmount;
        assert(balance == (_previousBalance - _withdrawAmount));
        emit Withdraw(_withdrawAmount);
    }

    function addGoal(string memory _goal) public {
        require(msg.sender == owner, "You are not the owner of this account");
        goals.push(_goal);
        emit GoalAdded(_goal);
    }

    function removeGoal(uint256 index) public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(index < goals.length, "Index out of bounds");
        string memory goalToRemove = goals[index];
        for (uint256 i = index; i < goals.length - 1; i++) {
            goals[i] = goals[i + 1];
        }
        goals.pop();
        emit GoalRemoved(goalToRemove);
    }
}
