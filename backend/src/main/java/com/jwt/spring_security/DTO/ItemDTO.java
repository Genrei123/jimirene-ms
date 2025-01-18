package com.jwt.spring_security.DTO;

public class ItemDTO {
    private Long itemID;
    private String itemName;
    private Long itemQuantity;
    private Double itemPrice;

    public Long getItemID() {
        return itemID;
    }
    public void setItemID(Long itemID) {
        this.itemID = itemID;
    }

    public String getItemName() {
        return itemName;
    }
    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public Long getItemQuantity() {
        return itemQuantity;
    }
    public void setItemQuantity(Long itemQuantity) {
        this.itemQuantity = itemQuantity;
    }

    public Double getItemPrice() {
        return itemPrice;
    }
    public void setItemPrice(Double itemPrice) {
        this.itemPrice = itemPrice;
    }
}

