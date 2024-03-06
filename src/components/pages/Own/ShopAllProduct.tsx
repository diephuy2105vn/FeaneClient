import {
    Container,
    Box,
    Button,
    List,
    ListItem,
    Checkbox,
    FormControlLabel,
    TextField,
    InputAdornment,
    IconButton,
    Hidden,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { CardProduct } from "../../Card";
import { ProductType } from "../../../constants/Product";
import { Link } from "react-router-dom";
import instance from "../../../axios";
import { ShopContext } from "../../layout/OwnLayout";
import { Search } from "@mui/icons-material";
import useTextFormatting from "../../../hooks/useFormatText";
import Title from "../../Title";

const ProductContainer = styled.div`
    margin: 0;
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
    @media (max-width: 600px) {
        grid-template-columns: 33% 33% 33%;
    }
`;

const StyledContainer = styled(Container)`
    &.MuiContainer-root {
        display: flex;
        flex-direction: row;
        gap: 16px;
        padding-top: 0;
    }
    @media (max-width: 600px) {
        &.MuiContainer-root {
            padding: 0;
        }
    }
`;

const StyledSlidebar = styled(Box)`
    &.MuiBox-root {
        background-color: white;
        padding: 16px;
        width: 20%;
        min-width: 120px;
        display: flex;
        border-radius: 5px;
        flex-direction: column;
        position: -webkit-sticky;
        position: sticky;
        max-height: calc(100vh - 96px);
        top: 80px;
    }
`;

const sorts = [
    { value: "NAME_ASC", title: "Name asc" },
    { value: "NAME_DESC", title: "Name desc" },
    { value: "PRICE_ASC", title: "Price asc" },
    { value: "PRICE_DESC", title: "Price desc" },
];

const ShopAllProduct = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const { shopActive } = useContext(ShopContext);
    const [selectChecked, setSelectChecked] = React.useState<{
        sort: string;
        types: string[];
    }>({
        sort: "",
        types: [],
    });

    const handleChangeCheckboxSort = (
        e: React.SyntheticEvent<Element, Event>,
        checked: boolean
    ) => {
        const target = e.target as HTMLInputElement;
        setSelectChecked((pre) => ({
            ...pre,
            sort: checked ? target.value : "",
        }));
    };
    const handleChangeCheckboxTypes = (
        e: React.SyntheticEvent<Element, Event>,
        checked: boolean
    ) => {
        const target = e.target as HTMLInputElement;
        setSelectChecked((pre) => ({
            ...pre,
            types: checked
                ? [...pre.types, target.value]
                : pre.types.filter((typePre) => typePre != target.value),
        }));
    };
    const { capitalizeTextFormat } = useTextFormatting();
    useEffect(() => {
        instance
            .get(
                `/own/${shopActive?.name}/product/all?types=${selectChecked.types}&&sort=${selectChecked.sort}`
            )
            .then((res) => setProducts(res.data))
            .catch((err) => {
                console.log(err);
            });
    }, [selectChecked]);

    return (
        <StyledContainer>
            <Hidden mdDown>
                <StyledSlidebar>
                    <Box>
                        <TextField
                            sx={{ margin: 0 }}
                            size="small"
                            placeholder="Find product"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton size="small">
                                            <Search />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <List>
                        <h3 style={{ fontSize: "16px", fontWeight: "600" }}>
                            Type
                        </h3>
                        {shopActive?.productTypes.map((type) => (
                            <ListItem
                                sx={{
                                    margin: 0,
                                    padding: 0,
                                    paddingRight: 1,
                                }}>
                                <FormControlLabel
                                    sx={{
                                        "& .MuiTypography-root": {
                                            fontSize: "14px",
                                        },
                                        "& .MuiSvgIcon-root": {
                                            fontSize: "16px",
                                        },
                                    }}
                                    value={type}
                                    checked={selectChecked.types.includes(type)}
                                    onChange={handleChangeCheckboxTypes}
                                    control={<Checkbox size="small" />}
                                    label={capitalizeTextFormat(type)}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <List>
                        <h3 style={{ fontSize: "16px", fontWeight: "600" }}>
                            Sort
                        </h3>
                        {sorts.map((sort) => (
                            <ListItem
                                sx={{
                                    margin: 0,
                                    padding: 0,
                                    paddingRight: 1,
                                }}>
                                <FormControlLabel
                                    sx={{
                                        "& .MuiTypography-root": {
                                            fontSize: "14px",
                                        },
                                        "& .MuiSvgIcon-root": {
                                            fontSize: "16px",
                                        },
                                    }}
                                    value={sort.value}
                                    checked={selectChecked.sort === sort.value}
                                    onChange={handleChangeCheckboxSort}
                                    control={<Checkbox size="small" />}
                                    label={sort.title}
                                />
                            </ListItem>
                        ))}
                    </List>
                </StyledSlidebar>
            </Hidden>
            <Box
                sx={{
                    flex: "1",
                    backgroundColor: "white",
                    padding: "16px",
                    borderRadius: "5px",
                }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: "16px",
                    }}>
                    <Title size="small">All product</Title>
                    <Button
                        color="primary"
                        variant="contained"
                        component={Link}
                        to={`/own/shop/${shopActive?.name}/product/create`}>
                        Add Product
                    </Button>
                </Box>
                <Hidden mdUp>
                    <Box
                        sx={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                            paddingBottom: "16px",
                        }}>
                        <TextField
                            sx={{ margin: 0, flex: 1 }}
                            size="small"
                            placeholder="Find product"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton size="small">
                                            <Search />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <FormControl size="small" sx={{ width: 60 }}>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={selectChecked.types}
                                size="small"
                                label="Type"
                                multiple
                                renderValue={(selected) => selected.join(", ")}>
                                {shopActive?.productTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        <FormControlLabel
                                            sx={{
                                                "& .MuiTypography-root": {
                                                    fontSize: "14px",
                                                },
                                                "& .MuiSvgIcon-root": {
                                                    fontSize: "16px",
                                                },
                                            }}
                                            value={type}
                                            checked={selectChecked.types.includes(
                                                type
                                            )}
                                            onChange={handleChangeCheckboxTypes}
                                            control={<Checkbox size="small" />}
                                            label={capitalizeTextFormat(type)}
                                        />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ m: 1, width: 60 }} size="small">
                            <InputLabel>Sort</InputLabel>
                            <Select
                                value={selectChecked.sort}
                                input={<OutlinedInput label="Sort" />}
                                renderValue={(selected) =>
                                    sorts.find(
                                        (sort) => sort.value === selected
                                    )?.title || ""
                                }>
                                {sorts.map((sort) => (
                                    <MenuItem
                                        key={sort.value}
                                        value={sort.value}>
                                        <FormControlLabel
                                            sx={{
                                                "& .MuiTypography-root": {
                                                    fontSize: "14px",
                                                },
                                                "& .MuiSvgIcon-root": {
                                                    fontSize: "16px",
                                                },
                                            }}
                                            value={sort.value}
                                            checked={
                                                selectChecked.sort ===
                                                sort.value
                                            }
                                            onChange={handleChangeCheckboxSort}
                                            control={<Checkbox size="small" />}
                                            label={sort.title}
                                        />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Hidden>
                <ProductContainer>
                    {products.map((product: ProductType, index: number) => (
                        <CardProduct
                            key={index}
                            product={product}
                            component={Link}
                            to={`/own/shop/${shopActive?.name}/product/${product.id}`}
                            isSetting={true}
                            handleClickDeleteCard={() => {
                                instance
                                    .delete(
                                        `/own/${shopActive?.name}/product/${product.id}`
                                    )
                                    .then(() => {
                                        setProducts((pre) =>
                                            pre.filter(
                                                (productPre) =>
                                                    productPre.id !== product.id
                                            )
                                        );
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                            }}
                        />
                    ))}
                    {products.map((product: ProductType, index: number) => (
                        <CardProduct
                            key={index}
                            product={product}
                            isSetting={true}
                            handleClickDeleteCard={() => {
                                instance
                                    .delete(
                                        `/own/${shopActive?.name}/product/${product.id}`
                                    )
                                    .then(() => {
                                        setProducts((pre) =>
                                            pre.filter(
                                                (productPre) =>
                                                    productPre.id !== product.id
                                            )
                                        );
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                            }}
                        />
                    ))}
                </ProductContainer>
            </Box>
        </StyledContainer>
    );
};

export default ShopAllProduct;
