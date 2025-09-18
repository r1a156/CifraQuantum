import pytest
import asyncio
from quantum_blockchain.core.quantum_chain import QuantumBlockchain

@pytest.mark.asyncio
async def test_blockchain():
    blockchain = QuantumBlockchain()
    assert blockchain.is_chain_valid()
    
    block = await blockchain.mine_block('test_miner')
    assert block.index == 1
    assert blockchain.is_chain_valid()
    
    blockchain.create_prediction_market('test_event', 'Test prediction', time.time() + 3600)
    block = await blockchain.mine_block('test_miner')
    assert block.data['predictions']
