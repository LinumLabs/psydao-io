import React, { useEffect } from 'react';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, FormControl, FormLabel, Input, VStack, HStack, IconButton, FormErrorMessage, Image, Text } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useQuery, useQueries } from "@tanstack/react-query";

const nftFolderBaseURL = "https://red-literary-tiglon-645.mypinata.cloud/ipfs/QmW4B6c7faRwsSzd5H3D28ECzFELrn5X8Z1TLTUAhKHWfW/"
const DEFAULT_NFT_AMOUNT = 13;

const getJSONMeta = async (nftIndex: number) => {
  const res = await fetch(`${nftFolderBaseURL}${nftIndex}`)
  if (!res.ok) {
    throw new Error('Failed to fetch JSON metadata');
  }
  return res.json()
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
  nfts: z.array(NFTMetadataSchema).length(DEFAULT_NFT_AMOUNT, `Must have exactly ${DEFAULT_NFT_AMOUNT} NFTs`),
});

type NFTUploaderForm = z.infer<typeof NFTUploaderSchema>;

const NFTUploaderForm = () => {
  const { data: existingNfts, isLoading, isError } = useQuery({
    queryKey: ['nftMetadata'],
    queryFn: async () => {
      const promises = Array.from({ length: DEFAULT_NFT_AMOUNT }, (_, i) => getJSONMeta(i));
      return Promise.all(promises);
    },
  });


  const { control, handleSubmit, formState: { errors }, reset } = useForm<NFTUploaderForm>({
    resolver: zodResolver(NFTUploaderSchema),
    defaultValues: {
      nfts: [],
    },
  });

  const { fields: nftFields } = useFieldArray({
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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading NFT metadata</div>;

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
                    <Input {...field} />
                    <FormErrorMessage>{errors.nfts?.[nftIndex]?.description?.message}</FormErrorMessage>
                  </FormControl>
                )}
              />

              <AttributesFieldArray nestIndex={nftIndex} {...{ control, errors }} />
            </VStack>
          </Box>
        ))}

        <Button type="submit" colorScheme="blue">
          Submit All NFTs
        </Button>
      </VStack>
    </Box>
  );
};

const AttributesFieldArray: React.FC<{
  nestIndex: number;
  control: any;
  errors: any;
}> = ({ nestIndex, control, errors }) => {
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