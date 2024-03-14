import {
    Container,
    TextField,
    FormControlLabel,
    FormLabel,
    Checkbox,
    Button,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Modal,
    SelectChangeEvent,
    FormHelperText,
} from "@mui/material";
import styled from "styled-components";
import { EProduct } from "../../../constants/Product";
import Title from "../../Title";
import Card from "../../Card";
import { FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Map, { MarkerType } from "../../Map";
import { AddLocation } from "@mui/icons-material";
import axios from "axios";
import { provinces } from "../../../constants/Province";
import { ShopType } from "../../../constants/Shop";
import { ShopContext } from "../../layout/OwnLayout";
import instance from "../../../axios";

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;
const Wrapper = styled(Container)`
    &.MuiContainer-root {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
`;

const StyledModal = styled(Modal)`
    .MuiBox-root {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 640px;
        height: 560px;
        max-width: 100%;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        padding: 16px 20px;
        border-radius: 10px;
        h3 {
            color: var(--text-color);
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 10px;
        }
    }
`;

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const ShopRegister = () => {
    const navigate = useNavigate();
    const [mapCenter, setMapCenter] = useState<MarkerType | null>(null);
    const { setShops, setShopActive } = useContext(ShopContext);
    const [shopInfo, setShopInfo] = useState<ShopType>({
        name: "",
        description: "",
        address: "Trần Đề, Sóc Trăng",
        productTypes: [],
        owner: null,
        createdAt: "",
    });
    const [isError, setIsError] = useState<boolean>(false);
    const [provinceSelect, setProvinceSelect] = useState<string>("");
    useEffect(() => {
        if (provinceSelect) {
            axios
                .get(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                        provinceSelect
                    )}&key=${googleMapsApiKey}`
                )
                .then((res) => {
                    setMapCenter(
                        res.data.results[0]
                            ? res.data.results[0].geometry.location
                            : { lat: 1, lng: 1 }
                    );
                });
        }
    }, [provinceSelect]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const handleSubmitForm = (e: FormEvent) => {
        e.preventDefault();
        if (
            shopInfo.name &&
            shopInfo.description &&
            shopInfo.address &&
            shopInfo.productTypes.length > 0
        ) {
            return instance
                .post("/shop/register", shopInfo)
                .then((res) => {
                    console.log(res);
                    if (setShops && setShopActive) {
                        setShops((pre: ShopType[] | null) =>
                            pre ? [...pre, shopInfo] : null
                        );
                        setShopActive(shopInfo);
                        navigate(`/own/shop/${shopInfo.name}/overview`);
                    }
                })
                .catch((e) => console.error(e));
        }
        return setIsError(true);
    };
    return (
        <Wrapper>
            <Card size="large" column={2} columnPhone={1}>
                <StyledForm onSubmit={handleSubmitForm}>
                    <Title size="small" textAlign="center">
                        Register Your Shop
                    </Title>
                    <TextField
                        variant="outlined"
                        label="Name of your shop"
                        error={isError && !shopInfo.name}
                        helperText={
                            isError &&
                            !shopInfo.name &&
                            "Please enter this field"
                        }
                        value={shopInfo.name}
                        onChange={(e) =>
                            setShopInfo((pre) => ({
                                ...pre,
                                name: e.target.value,
                            }))
                        }
                    />
                    <TextField
                        variant="outlined"
                        label="Descriprion of your shop"
                        error={isError && !shopInfo.description}
                        helperText={
                            isError &&
                            !shopInfo.description &&
                            "Please enter this field"
                        }
                        value={shopInfo.description}
                        onChange={(e) =>
                            setShopInfo((pre) => ({
                                ...pre,
                                description: e.target.value,
                            }))
                        }
                    />
                    <FormControl fullWidth error={isError && !shopInfo.address}>
                        <InputLabel>Provincial address</InputLabel>
                        <Select
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 40 * 5 + 8,
                                    },
                                },
                            }}
                            value={provinceSelect}
                            onChange={(event: SelectChangeEvent) => {
                                setProvinceSelect(event.target.value as string);
                            }}
                            label="Provincial address">
                            {provinces.map((province) => (
                                <MenuItem
                                    sx={{ height: 40 }}
                                    value={`${province}, Việt Nam`}>
                                    {province}
                                </MenuItem>
                            ))}
                        </Select>
                        <Button
                            sx={{ mt: 2 }}
                            onClick={() => setOpenModal(true)}
                            startIcon={<AddLocation />}
                            variant="outlined"
                            size="large"
                            disabled={!mapCenter}>
                            Address of your shop
                        </Button>
                        {isError && !shopInfo.address && (
                            <FormHelperText>
                                Please choose address of your shop
                            </FormHelperText>
                        )}
                    </FormControl>

                    <FormControl
                        error={isError && shopInfo.productTypes.length === 0}>
                        <FormLabel>Product type of your shop</FormLabel>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "auto auto",
                            }}>
                            <FormControlLabel
                                value={EProduct.CLOTHES}
                                control={<Checkbox />}
                                label="Clothes"
                                checked={shopInfo.productTypes.includes(
                                    EProduct.CLOTHES
                                )}
                                onChange={(e) =>
                                    setShopInfo((pre) => ({
                                        ...pre,
                                        productTypes: pre.productTypes.includes(
                                            (e.target as HTMLInputElement)
                                                .value as EProduct
                                        )
                                            ? pre.productTypes.filter(
                                                  (item) =>
                                                      item !==
                                                      ((
                                                          e.target as HTMLInputElement
                                                      ).value as EProduct)
                                              )
                                            : [
                                                  ...pre.productTypes,
                                                  (e.target as HTMLInputElement)
                                                      .value as EProduct,
                                              ],
                                    }))
                                }
                            />
                            <FormControlLabel
                                value={EProduct.SHOES}
                                control={<Checkbox />}
                                label="Shoes"
                                checked={shopInfo.productTypes.includes(
                                    EProduct.SHOES
                                )}
                                onChange={(e) =>
                                    setShopInfo((pre) => ({
                                        ...pre,
                                        productTypes: pre.productTypes.includes(
                                            (e.target as HTMLInputElement)
                                                .value as EProduct
                                        )
                                            ? pre.productTypes.filter(
                                                  (item) =>
                                                      item !==
                                                      ((
                                                          e.target as HTMLInputElement
                                                      ).value as EProduct)
                                              )
                                            : [
                                                  ...pre.productTypes,
                                                  (e.target as HTMLInputElement)
                                                      .value as EProduct,
                                              ],
                                    }))
                                }
                            />
                            <FormControlLabel
                                value={EProduct.ACCESSORIES}
                                control={<Checkbox />}
                                label="Accessories"
                                checked={shopInfo.productTypes.includes(
                                    EProduct.ACCESSORIES
                                )}
                                onChange={(e) =>
                                    setShopInfo((pre) => ({
                                        ...pre,
                                        productTypes: pre.productTypes.includes(
                                            (e.target as HTMLInputElement)
                                                .value as EProduct
                                        )
                                            ? pre.productTypes.filter(
                                                  (item) =>
                                                      item !==
                                                      ((
                                                          e.target as HTMLInputElement
                                                      ).value as EProduct)
                                              )
                                            : [
                                                  ...pre.productTypes,
                                                  (e.target as HTMLInputElement)
                                                      .value as EProduct,
                                              ],
                                    }))
                                }
                            />
                            {isError && shopInfo.productTypes.length === 0 && (
                                <FormHelperText>
                                    Please choose address of your shop
                                </FormHelperText>
                            )}
                        </Box>
                    </FormControl>
                    <Button type="submit" variant="contained" size="large">
                        Submit
                    </Button>
                </StyledForm>
            </Card>
            {mapCenter && (
                <StyledModal
                    open={openModal}
                    onClose={() => setOpenModal(false)}>
                    <Box>
                        <h3>Google Map</h3>
                        <Map
                            center={mapCenter}
                            address={shopInfo.address}
                            handleSetAddress={(address) =>
                                setShopInfo((pre) => ({
                                    ...pre,
                                    address: address,
                                }))
                            }
                        />
                    </Box>
                </StyledModal>
            )}
        </Wrapper>
    );
};

export default ShopRegister;
