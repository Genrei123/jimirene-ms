package com.jwt.spring_security.model;

import jakarta.persistence.*;
import org.antlr.v4.runtime.misc.NotNull;

import java.util.Date;

@Entity
public class Services {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long serviceID;


    private Date service_date;
    private String service_name;
    private String service_description;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "branchID", referencedColumnName = "branchID")
    private Branch branch;



    private double service_price;

    public Branch getBranch() {
        return branch;
    }

    public void setBranch(Branch branch) {
        this.branch = branch;
    }

    public Long getServiceID() {
        return serviceID;
    }

    public void setServiceID(Long serviceID) {
        this.serviceID = serviceID;
    }

    public String getService_name() {
        return service_name;
    }

    public void setService_name(String service_name) {
        this.service_name = service_name;
    }

    public String getService_description() {
        return service_description;
    }

    public void setService_description(String service_description) {
        this.service_description = service_description;
    }

    public double getService_price() {
        return service_price;
    }

    public void setService_price(double service_price) {
        this.service_price = service_price;
    }
}
