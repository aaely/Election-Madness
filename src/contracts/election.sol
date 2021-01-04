
//SPDX-License-Identifier: MIT

pragma solidity >0.5.0 <0.8.0;

contract Election {

    string public name;
    uint public totalVotes = 0;
    uint public candidateCount = 0;
    uint public voterCount = 0;
    uint public registeredCount = 0;
    address payable owner;
    mapping(uint => Candidate) public candidates;
    mapping(uint => Voter) public voters;
    mapping(address => bool) public regVoters;
    mapping(address => bool) public voted;

    struct Candidate {
        uint id;
        string name;
        string party;
        uint voteCount;
    }

    struct Voter {
        uint id;
        string name;
        address voter;
        uint votedFor;
    }

    event VoteCast(
        uint id,
        string name,
        bool hasVoted,
        address voter
    );

    event VoterCreated(
        uint id,
        string name,
        address voter
    );

    event CandidateCreated(
        uint id,
        string name,
        string party,
        uint voteCount
    );

    event AddedToRegVoters(
        address voter,
        bool status,
        uint count
    );

    event Voted(
        address voter,
        uint votedFor
    );

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier notRegestered {
        require(!regVoters[msg.sender]);
        _;
    }

    function addToRegVoters(address _address) public {
        require(!regVoters[_address], 'already registered');
        require(!voted[_address], 'youve already voted');
        regVoters[_address] = true;
        
    }

    function createCandidate(string memory _name, string memory _party) public onlyOwner {
        require(bytes(_name).length > 0 && bytes(_party).length > 0);
        require(candidateCount < 5);

        candidateCount++;

        candidates[candidateCount] = Candidate(candidateCount, _name, _party, 0);      

        emit CandidateCreated(candidateCount, _name, _party, 0);
    }

    function createVoter(string memory _name) public {

        require(bytes(_name).length > 0, 'name is a required field');

        require(regVoters[msg.sender] == false);
 
        voterCount++;

        voters[voterCount] = Voter(voterCount, _name, msg.sender, 0);

        addToRegVoters(msg.sender);

        emit VoterCreated(voterCount, _name, msg.sender);
        
        emit AddedToRegVoters(msg.sender, regVoters[msg.sender], registeredCount);
    }

    function castVote(uint _candidateId, uint _voterId) public {
        require( _candidateId > 0 && _candidateId <= candidateCount, 'invalid candidate');
        require(regVoters[msg.sender] == true, 'registeration required');
        require(voted[msg.sender] == false, 'you have already voted');
        
        Candidate memory _candidate = candidates[_candidateId];

        Voter memory _voter = voters[_voterId];

        _candidate.voteCount = _candidate.voteCount + 1;
        
        totalVotes++;

        _voter.votedFor = _candidateId;

        voters[_voterId] = _voter;
        
        voted[msg.sender] = true;
        
        candidates[_candidateId] = _candidate;

        emit Voted(_voter.voter, _candidateId);

    }
}