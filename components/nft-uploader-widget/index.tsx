import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm, Controller, Control, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, FormControl, FormLabel, Input, VStack, HStack, IconButton, FormErrorMessage, Image, Text, Textarea, Progress, useToast } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useQuery } from "@tanstack/react-query";
import psyNFTAbi from '@/abis/psyNFTAbiSepolia.json'
import { useReadContract } from 'wagmi';
import { useAccount } from 'wagmi';

const contractAddress = '0x64e78537782095a38E3785431bE3647856980FfA';

type NftMetadata = {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

const getJSONMeta = async (nftIndex: number, baseUri: string): Promise<NftMetadata> => {
  if (!baseUri) throw new Error('Base URI not available');
  const res = await fetch(`${baseUri}${nftIndex}`)
  if (!res.ok) {
    throw new Error('Failed to fetch JSON metadata');
  }
  return res.json() as Promise<NftMetadata>
}

const urlSchema = z
  .string()
  .refine((value) => /^(https?):\/\/(?=.*\.[a-z]{2,})[^\s$.?#].[^\s]*$/i.test(value), {
    message: 'Please enter a valid URL',
  });

const TraitSchema = z.object({
  trait_type: z.string().min(1, 'Trait type is required'),
  value: z.string().min(1, 'Trait value is required'),
});

const NFTMetadataSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  image: urlSchema.optional(),
  newImage: z.instanceof(File).optional(),
  attributes: z.array(TraitSchema),
});

const NFTUploaderSchema = z.object({
  nfts: z.array(NFTMetadataSchema).min(1, 'Must have at least one NFT'),
});

type NFTUploaderForm = z.infer<typeof NFTUploaderSchema>;

const NFTUploaderForm = () => {
  const { address } = useAccount()
  const [uploadProgress, setUploadProgress] = useState(0);
  const toast = useToast();

  const { data: baseUri, isError: isBaseUriError, isLoading: isBaseUriLoading } = useReadContract({
    address: contractAddress,
    abi: psyNFTAbi,
    functionName: 'baseUri',
  });

  const { data: tokenIdData, isError: isTokenIdError, isLoading: isTokenIdLoading } = useReadContract({
    address: contractAddress,
    abi: psyNFTAbi,
    functionName: 'tokenId',
  });

  const nftCount = tokenIdData ? Number((tokenIdData as string).toString()) : 0;

  const { data: existingNfts, isLoading: areNftsLoading, isError: isNftsError } = useQuery({
    queryKey: ['nftMetadata', baseUri, nftCount],
    queryFn: async () => {
      if (!baseUri) throw new Error('Base URI not available');
      const promises = Array.from({ length: nftCount }, (_, i) => getJSONMeta(i, baseUri as string));
      const results = await Promise.allSettled(promises);
      return results
        .map((result, index) => {
          if (result.status === 'fulfilled') {
            return result.value;
          } else {
            console.error(`Failed to fetch NFT ${index}:`, result.reason);
            return null;
          }
        })
        .filter(result => result !== null);
    },
    enabled: !!baseUri && nftCount > 0,
  });


  const { control, handleSubmit, formState: { errors }, reset } = useForm<NFTUploaderForm>({
    resolver: zodResolver(NFTUploaderSchema),
    defaultValues: {
      nfts: [],
    },
  });

  const { fields: nftFields, append } = useFieldArray({
    control,
    name: 'nfts',
  });

  useEffect(() => {
    if (existingNfts) {
      reset({
        nfts: existingNfts
      })
    }
  }, [existingNfts, reset])

  const onSubmit = (data: NFTUploaderForm) => {
    console.log(data);
    // Handle form submission, e.g., upload to IPFS
  };

  if (isBaseUriLoading || isTokenIdLoading || areNftsLoading) return <div>Loading...</div>;
  if (isBaseUriError || isTokenIdError || isNftsError) return <div>Error loading NFT data</div>;



  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={8} align="stretch">
        {nftFields.map((nftField, nftIndex) => (
          <Box key={nftField.id} p={4} borderWidth={1} borderRadius="md">
            <VStack spacing={4} align="stretch">
              <Text fontSize="xl" fontWeight="bold">NFT #{nftIndex}</Text>

              <Controller
                name={`nfts.${nftIndex}.image`}
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <FormLabel>Current Image</FormLabel>
                    {field.value && (
                      <Image src={field.value} alt={`NFT ${nftIndex}`} maxH="200px" objectFit="contain" />
                    )}
                    <Input {...field} placeholder="Image URL" mt={2} />
                    <FormErrorMessage>{errors.nfts?.[nftIndex]?.image?.message}</FormErrorMessage>
                  </FormControl>
                )}
              />

              <Controller
                name={`nfts.${nftIndex}.newImage`}
                control={control}
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormControl>
                    <FormLabel>Upload New Image</FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files?.[0])}
                      {...rest}
                    />
                    {value && <Text mt={2}>New image selected: {value.name}</Text>}
                  </FormControl>
                )}
              />

              <Controller
                name={`nfts.${nftIndex}.name`}
                control={control}
                render={({ field }) => (
                  <FormControl isInvalid={!!errors.nfts?.[nftIndex]?.name}>
                    <FormLabel>Name</FormLabel>
                    <Input {...field} />
                    <FormErrorMessage>{errors.nfts?.[nftIndex]?.name?.message}</FormErrorMessage>
                  </FormControl>
                )}
              />

              <Controller
                name={`nfts.${nftIndex}.description`}
                control={control}
                render={({ field }) => (
                  <FormControl isInvalid={!!errors.nfts?.[nftIndex]?.description}>
                    <FormLabel>Description</FormLabel>
                    <Textarea {...field} rows={4} />
                    <FormErrorMessage>{errors.nfts?.[nftIndex]?.description?.message}</FormErrorMessage>
                  </FormControl>
                )}
              />

              <AttributesFieldArray nestIndex={nftIndex} {...{ control, errors }} />
            </VStack>
          </Box>
        ))}

        <Button
          onClick={() => append({
            name: '',
            description: '',
            image: '',
            attributes: []
          })}
          leftIcon={<AddIcon />}
        >
          Add New NFT
        </Button>

        {uploadProgress > 0 && <Progress value={uploadProgress} />}

        <Button type="submit" colorScheme="blue">
          Submit All NFTs
        </Button>
      </VStack>
    </Box>
  );
};

type AttributesFieldArrayProps = {
  nestIndex: number;
  control: Control<NFTUploaderForm>;
  errors: FieldErrors<NFTUploaderForm>;
}

const AttributesFieldArray = ({ nestIndex, control, errors }: AttributesFieldArrayProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `nfts.${nestIndex}.attributes`,
  });

  return (
    <Box>
      <FormLabel>Attributes</FormLabel>
      {fields.map((field, k) => (
        <HStack key={field.id} mb={2}>
          <Controller
            name={`nfts.${nestIndex}.attributes.${k}.trait_type`}
            control={control}
            render={({ field }) => (
              <FormControl isInvalid={!!errors.nfts?.[nestIndex]?.attributes?.[k]?.trait_type}>
                <Input {...field} placeholder="Trait type" />
                <FormErrorMessage>{errors.nfts?.[nestIndex]?.attributes?.[k]?.trait_type?.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          <Controller
            name={`nfts.${nestIndex}.attributes.${k}.value`}
            control={control}
            render={({ field }) => (
              <FormControl isInvalid={!!errors.nfts?.[nestIndex]?.attributes?.[k]?.value}>
                <Input {...field} placeholder="Trait value" />
                <FormErrorMessage>{errors.nfts?.[nestIndex]?.attributes?.[k]?.value?.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          <IconButton
            aria-label="Remove trait"
            icon={<DeleteIcon />}
            onClick={() => remove(k)}
          />
        </HStack>
      ))}
      <Button leftIcon={<AddIcon />} onClick={() => append({ trait_type: '', value: '' })}>
        Add Trait
      </Button>
    </Box>
  );
};

export default NFTUploaderForm;