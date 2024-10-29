import { describe, it, expect, vi, beforeEach } from 'vitest'
import { main } from './voteCounter'
import { getPsycHolders, PsycHolder } from './getPsycHolders'
import { getSnapshotProposals, getVotesOnProposalById, Proposal, type Vote } from './getSnapshotProposalsAndVotes'
import { uploadArrayToIpfs } from './ipfs'
import { TEST_ENV } from '@/constants/claims'

// Mock all external dependencies
vi.mock('./getPsycHolders')
vi.mock('./getSnapshotProposalsAndVotes')
vi.mock('./ipfs')
vi.mock('@/constants/claims', () => ({
  TEST_ENV: true,
  SNAPSHOT_GRAPHQL_URL: 'https://hub.snapshot.org/graphql',
  PSYDAO_ENS: 'psydao.eth',
  NEXT_PUBLIC_SUBGRAPH_URL: 'https://api.studio.thegraph.com/query/83978/psydao-sepolia/version/latest'
}))

describe('voteCounter main function', () => {
  const mockInput = {
    startTimeStamp: 1723932000,
    endTimeStamp: 1726005600,
    totalAmountOfTokens: 7675.0616,
    batchId: 25
  }

  const mockProposal: Proposal = {
    id: '0x123',
    snapshot: '123456',
    start: 1723932000,
    end: 1726005600
  }

  const mockPsycHolders: PsycHolder[] = [
    { owner: '0x7c6d212e46e38f7c1a9c12d1664ce90b202715a4' },
    { owner: '0x8754a4c886f8cb77a1d2f38470c653ddb4727f21' },
  ]

  const mockVotes: Vote[] = [
    {
      id: '0xvote1',
      voter: '0x7c6d212e46e38f7c1a9c12d1664ce90b202715a4',
      created: 1723932100
    },
    {
      id: '0xvote2',
      voter: '0x8754a4c886f8cb77a1d2f38470c653ddb4727f21',
      created: 1723932200
    }
  ]

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return empty result when no proposals found', async () => {
    vi.mocked(getSnapshotProposals).mockResolvedValue([])

    const result = await main(
      mockInput.startTimeStamp,
      mockInput.endTimeStamp,
      mockInput.totalAmountOfTokens,
      mockInput.batchId
    )

    expect(result).toEqual({
      balances: [],
      merkleRoot: "0x",
      ipfsHash: ""
    })
    expect(getSnapshotProposals).toHaveBeenCalledWith(
      mockInput.startTimeStamp,
      mockInput.endTimeStamp
    )
  })

  it('should calculate distribution correctly with valid inputs', async () => {
    // Add debug logging
    console.log('Starting test with mock data:', { mockProposal, mockVotes })

    vi.mocked(getSnapshotProposals).mockResolvedValue([mockProposal])
    vi.mocked(getPsycHolders).mockResolvedValue(mockPsycHolders as PsycHolder[])
    vi.mocked(getVotesOnProposalById).mockResolvedValue(mockVotes as Vote[])
    vi.mocked(uploadArrayToIpfs).mockResolvedValue('QmHash123')

    const result = await main(
      mockInput.startTimeStamp,
      mockInput.endTimeStamp,
      mockInput.totalAmountOfTokens,
      mockInput.batchId
    )

    // Log the result to see what we're getting
    console.log('Test result:', result)

    expect(result.merkleRoot).toBeDefined()
    expect(result.merkleRoot).not.toBe('0x')
    expect(result.balances).toBeDefined()
    expect(result.balances.length).toBeGreaterThan(0)
    expect(result.ipfsHash).toBe('QmHash123')
    expect(result.balances).toHaveLength(2) // Two voters

    // Verify the balances are calculated correctly
    const totalTokens = result.balances.reduce(
      (sum, balance) => sum + parseFloat(balance.tokens),
      0
    )
    expect(totalTokens).toBeCloseTo(mockInput.totalAmountOfTokens, 4)
  })

  it('should handle filtered out proposals correctly', async () => {
    const filteredProposal: Proposal = {
      id: '0x71166758c2aa68fe1d1d5eb52135a3caafc07284ec1d0b2c6dba8ef161bf7a4c',
      snapshot: '123456',
      start: mockInput.startTimeStamp,
      end: mockInput.endTimeStamp
    }

    // Mock only the necessary functions
    vi.mocked(getSnapshotProposals).mockResolvedValue([filteredProposal])
    // Mock getPsycHolders to return empty array to prevent further processing
    vi.mocked(getPsycHolders).mockResolvedValue([])
    // Mock getVotesOnProposalById to return empty array
    vi.mocked(getVotesOnProposalById).mockResolvedValue([])
    // Mock IPFS upload
    vi.mocked(uploadArrayToIpfs).mockResolvedValue("")

    const result = await main(
      mockInput.startTimeStamp,
      mockInput.endTimeStamp,
      mockInput.totalAmountOfTokens,
      mockInput.batchId
    )

    // Should return empty result when only filtered proposals exist
    expect(result).toEqual({
      balances: [],
      merkleRoot: "0x",
      ipfsHash: ""
    })
  })

  it('should calculate correct token distribution with multiple proposals', async () => {
    const multipleProposals = [
      mockProposal,
      { ...mockProposal, id: '0x456' },
      { ...mockProposal, id: '0x789' }
    ]


    vi.mocked(getSnapshotProposals).mockResolvedValue(multipleProposals)
    vi.mocked(getPsycHolders).mockResolvedValue(mockPsycHolders as PsycHolder[])

    // Create a single vote array for the second proposal
    const singleVote: Vote[] = [mockVotes[0]!] // Non-null assertion since we know it exists

    vi.mocked(getVotesOnProposalById)
      .mockResolvedValueOnce(mockVotes)
      .mockResolvedValueOnce(singleVote) // Second proposal only one vote
      .mockResolvedValueOnce(mockVotes as Vote[]) // Third proposal both votes

    const result = await main(
      mockInput.startTimeStamp,
      mockInput.endTimeStamp,
      mockInput.totalAmountOfTokens,
      mockInput.batchId
    )

    expect(result.balances).toHaveLength(2)

    // Explicitly check and access array elements
    expect(result.balances[0]).toBeDefined()
    expect(result.balances[1]).toBeDefined()

    // First voter should have more tokens (voted on all proposals)
    const [firstVoter, secondVoter] = result.balances

    if (!firstVoter || !secondVoter) {
      throw new Error('Test failed: Expected both voters to have balances')
    }

    const firstVoterTokens = parseFloat(firstVoter.tokens)
    const secondVoterTokens = parseFloat(secondVoter.tokens)

    expect(firstVoterTokens)
      .toBeGreaterThan(secondVoterTokens)

    // Total should still equal input amount
    const totalTokens = result.balances.reduce(
      (sum, balance) => sum + parseFloat(balance.tokens),
      0
    )
    expect(totalTokens).toBeCloseTo(mockInput.totalAmountOfTokens, 4)
  })

  it('should handle errors in snapshot proposals fetch', async () => {
    vi.mocked(getSnapshotProposals).mockRejectedValue(new Error('API Error'))

    await expect(main(
      mockInput.startTimeStamp,
      mockInput.endTimeStamp,
      mockInput.totalAmountOfTokens,
      mockInput.batchId
    )).rejects.toThrow('API Error')
  })

  it('should handle errors in PSYC holders fetch', async () => {
    vi.mocked(getSnapshotProposals).mockResolvedValue([mockProposal])
    vi.mocked(getPsycHolders).mockRejectedValue(new Error('Holders API Error'))

    await expect(main(
      mockInput.startTimeStamp,
      mockInput.endTimeStamp,
      mockInput.totalAmountOfTokens,
      mockInput.batchId
    )).rejects.toThrow('Holders API Error')
  })

  it('should handle errors in votes fetch', async () => {
    vi.mocked(getSnapshotProposals).mockResolvedValue([mockProposal])
    vi.mocked(getPsycHolders).mockResolvedValue(mockPsycHolders as PsycHolder[])
    vi.mocked(getVotesOnProposalById).mockRejectedValue(new Error('Votes API Error'))

    await expect(main(
      mockInput.startTimeStamp,
      mockInput.endTimeStamp,
      mockInput.totalAmountOfTokens,
      mockInput.batchId
    )).rejects.toThrow('Votes API Error')
  })

  it('should handle errors in IPFS upload', async () => {
    vi.mocked(getSnapshotProposals).mockResolvedValue([mockProposal])
    vi.mocked(getPsycHolders).mockResolvedValue(mockPsycHolders as PsycHolder[])
    vi.mocked(getVotesOnProposalById).mockResolvedValue(mockVotes)
    vi.mocked(uploadArrayToIpfs).mockRejectedValue(new Error('IPFS Error'))

    await expect(main(
      mockInput.startTimeStamp,
      mockInput.endTimeStamp,
      mockInput.totalAmountOfTokens,
      mockInput.batchId
    )).rejects.toThrow('IPFS Error')
  })

  it('should handle no eligible voters correctly', async () => {
    const proposal: Proposal = {
      id: '0x123',
      snapshot: '123456',
      start: mockInput.startTimeStamp,
      end: mockInput.endTimeStamp
    }

    vi.mocked(getSnapshotProposals).mockResolvedValue([proposal])
    vi.mocked(getPsycHolders).mockResolvedValue([])  // No PSYC holders
    vi.mocked(getVotesOnProposalById).mockResolvedValue([])
    vi.mocked(uploadArrayToIpfs).mockResolvedValue("")

    const result = await main(
      mockInput.startTimeStamp,
      mockInput.endTimeStamp,
      mockInput.totalAmountOfTokens,
      mockInput.batchId
    )

    console.log('No eligible voters result:', result)

    expect(result).toEqual({
      balances: [],
      merkleRoot: "0x",
      ipfsHash: ""
    })
  })
})