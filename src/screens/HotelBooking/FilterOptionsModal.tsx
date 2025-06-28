import React, { useState } from 'react';
import { Modal, View, Text, Pressable, ScrollView, TextInput } from 'react-native';

const PRIMARY_COLOR = '#0E54EC';

const STAR_OPTIONS = [5, 4, 3, 2, 1];
const CHAIN_HOTELS = ['OYO', 'Taj', 'Marriott', 'All'];
const HOTEL_AMENITIES = ['24-hour front desk', 'Free wifi', 'Elevator', 'Self parking', 'Laundry'];
const ROOM_AMENITIES = ['Spa', 'Bathtub', 'Home theatre', 'Private pool', 'Balcony'];

const FilterOptionsModal = () => {
    const [priceRange, setPriceRange] = useState<[number, number]>([1000, 5000]);
    const [starRating, setStarRating] = useState<number | null>(null);
    const [userRating, setUserRating] = useState<number | null>(null);
    const [selectedChains, setSelectedChains] = useState<string[]>([]);
    const [selectedHotelAmenities, setSelectedHotelAmenities] = useState<string[]>([]);
    const [selectedRoomAmenities, setSelectedRoomAmenities] = useState<string[]>([]);

    const handleChainToggle = (chain: string) => {
        setSelectedChains((prev) =>
            prev.includes(chain) ? prev.filter((c) => c !== chain) : [...prev, chain]
        );
    };

    const handleHotelAmenityToggle = (amenity: string) => {
        setSelectedHotelAmenities((prev) =>
            prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
        );
    };

    const handleRoomAmenityToggle = (amenity: string) => {
        setSelectedRoomAmenities((prev) =>
            prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
        );
    };

    const handleClear = () => {
        setPriceRange([1000, 5000]);
        setStarRating(null);
        setUserRating(null);
        setSelectedChains([]);
        setSelectedHotelAmenities([]);
        setSelectedRoomAmenities([]);
    };

    return (
        <View className="flex-1 ">
            <View className=" rounded-t-2xl bg-white p-6">
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Price Range */}
                    <Text className="mb-4 font-semibold text-lg font-poppins">Price range per night</Text>
                    <View className="mb-2 flex-row items-center">
                        <TextInput
                            className="mr-2 w-20 rounded border border-gray-300 px-2 py-1"
                            keyboardType="numeric"
                            value={priceRange[0].toString()}
                            onChangeText={(v) => setPriceRange([Number(v) || 0, priceRange[1]])}
                        />
                        <Text className="mx-1 font-poppins">-</Text>
                        <TextInput
                            className="ml-2 w-20 rounded border border-gray-300 px-2 py-1"
                            keyboardType="numeric"
                            value={priceRange[1].toString()}
                            onChangeText={(v) => setPriceRange([priceRange[0], Number(v) || 0])}
                        />
                    </View>
                    {/* Simulated range slider */}
                    <View className="mb-4 flex-row items-center">
                        <Pressable
                            className="h-2 flex-1 rounded bg-gray-200"
                            onPress={() => {}}
                            style={{
                                position: 'relative',
                                justifyContent: 'center',
                            }}>
                            <View
                                className="absolute h-2 rounded"
                                style={{
                                    left: `${((priceRange[0] - 0) / 10000) * 100}%`,
                                    width: `${((priceRange[1] - priceRange[0]) / 10000) * 100}%`,
                                    backgroundColor: PRIMARY_COLOR,
                                }}
                            />
                            {/* Handles */}
                            <View
                                className="absolute h-5 w-5 rounded-full border-2 border-white"
                                style={{
                                    left: `${((priceRange[0] - 0) / 10000) * 100}%`,
                                    backgroundColor: PRIMARY_COLOR,
                                    top: -6,
                                }}
                            />
                            <View
                                className="absolute h-5 w-5 rounded-full border-2 border-white"
                                style={{
                                    left: `${((priceRange[1] - 0) / 10000) * 100}%`,
                                    backgroundColor: PRIMARY_COLOR,
                                    top: -6,
                                }}
                            />
                        </Pressable>
                    </View>

                    <View className="my-4 border-b border-gray-200" />

                    {/* Star Rating */}
                    <Text className="mb-2 font-semibold text-lg font-poppins">Star Rating</Text>
                    <View className="mb-4 flex-row">
                        {STAR_OPTIONS.map((star) => (
                            <Pressable
                                key={star}
                                className={`mx-1 flex-1 rounded-full border py-2 ${
                                    starRating === star ? 'border-blue-700 bg-[#0E54EC] ' : 'border-[#0E54EC] bg-white'
                                }`}
                                onPress={() => setStarRating(star)}>
                                <Text
                                    className={`text-center font-medium font-poppins ${
                                        starRating === star ? 'text-white' : 'text-[#0E54EC]'
                                    }`}>
                                    ★&nbsp;{star}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <View className="my-4 border-b border-gray-200" />

                    {/* User Rating */}
                    <Text className="mb-2 font-semibold text-lg font-poppins">User Rating</Text>
                    <View className="mb-4 flex-row">
                        {[9, 8, 7, 6].map((rating) => (
                            <Pressable
                                key={rating}
                                className={`mx-1 flex-1 rounded-full border py-2 ${
                                    userRating === rating ? 'border-blue-700 bg-[#0E54EC] ' : 'border-[#0E54EC] bg-white'
                                }`}
                                onPress={() => setUserRating(rating)}>
                                <Text
                                    className={`text-center font-medium font-poppins ${
                                        userRating === rating ? 'text-white' : 'text-[#0E54EC]'
                                    }`}>
                                    {rating}+
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <View className="my-4 border-b border-gray-200" />

                    {/* Chain Hotels */}
                    <Text className="mb-2 font-semibold text-lg font-poppins">Chain Hotels</Text>
                    <View className="mb-4 flex-col flex-wrap">
                        {CHAIN_HOTELS.map((chain) => (
                            <Pressable
                                key={chain}
                                className={`mb-2 mr-4 flex-row items-center`}
                                onPress={() => handleChainToggle(chain)}>
                                <View
                                    className={`mr-2 h-5 w-5 rounded border ${
                                        selectedChains.includes(chain)
                                            ? 'border-blue-700 bg-blue-100'
                                            : 'border-gray-300 bg-white'
                                    }`}
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    {selectedChains.includes(chain) && (
                                        <View className="mx-auto my-auto h-3 w-3 rounded bg-blue-700" />
                                    )}
                                </View>
                                <Text className="text-gray-700 font-poppins">{chain}</Text>
                            </Pressable>
                        ))}
                    </View>

                    <View className="my-4 border-b border-gray-200" />

                    {/* Hotel Amenities */}
                    <Text className="mb-2 font-semibold text-lg font-poppins">Hotel Amenities</Text>
                    <View className="mb-4 flex-col flex-wrap">
                        {HOTEL_AMENITIES.map((amenity) => (
                            <Pressable
                                key={amenity}
                                className="mb-2 mr-4 flex-row items-center"
                                onPress={() => handleHotelAmenityToggle(amenity)}>
                                <View
                                    className={`mr-2 h-5 w-5 rounded border ${
                                        selectedHotelAmenities.includes(amenity)
                                            ? 'border-blue-700 bg-blue-100'
                                            : 'border-gray-300 bg-white'
                                    }`}>
                                    {selectedHotelAmenities.includes(amenity) && (
                                        <View className="mx-auto my-auto h-3 w-3 rounded bg-blue-700" />
                                    )}
                                </View>
                                <Text className="text-gray-700 font-poppins">{amenity}</Text>
                            </Pressable>
                        ))}
                    </View>

                    <View className="my-4 border-b border-gray-200" />

                    {/* Room Amenities */}
                    <Text className="mb-2 font-semibold text-lg font-poppins">Room Amenities</Text>
                    <View className="mb-4 flex-col flex-wrap">
                        {ROOM_AMENITIES.map((amenity) => (      
                            <Pressable
                                key={amenity}
                                className="mb-2 mr-4 flex-row items-center"
                                onPress={() => handleRoomAmenityToggle(amenity)}>
                                <View
                                    className={`mr-2 h-5 w-5 rounded border ${
                                        selectedHotelAmenities.includes(amenity)
                                            ? 'border-blue-700 bg-blue-100'
                                            : 'border-gray-300 bg-white'
                                    }`}>
                                    {selectedHotelAmenities.includes(amenity) && (
                                        <View className="mx-auto my-auto h-3 w-3 rounded bg-blue-700" />
                                    )}
                                </View>
                                <Text className="text-gray-700 font-poppins">{amenity}</Text>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default FilterOptionsModal;

