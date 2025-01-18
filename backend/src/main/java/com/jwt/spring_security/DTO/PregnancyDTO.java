package com.jwt.spring_security.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.antlr.v4.runtime.misc.NotNull;

import java.util.Date;

public class PregnancyDTO {
    private Integer gravida;
    private Integer para;
    private Integer term;
    @JsonProperty("pre_term")
    @NotNull// Ensure it’s not null
    private Integer preTerm; // Maps to `pre_term`
    private Integer abortion; // Nullable
    private Integer living; // Nullable

    @JsonProperty("LMP")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date LMP; // Nullable
    @JsonProperty("EDC")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date EDC; // Nullable
    @JsonProperty("IT_date")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date ITDate; // Maps to `IT_date`
    private Date menarche; // Nullable

    public Integer getGravida() {
        return gravida;
    }

    public void setGravida(Integer gravida) {
        this.gravida = gravida;
    }

    public Integer getPara() {
        return para;
    }

    public void setPara(Integer para) {
        this.para = para;
    }

    public Integer getTerm() {
        return term;
    }

    public void setTerm(Integer term) {
        this.term = term;
    }

    public Integer getPreTerm() {
        return preTerm;
    }

    public void setPreTerm(Integer preTerm) {
        this.preTerm = preTerm;
    }

    public Integer getAbortion() {
        return abortion;
    }

    public void setAbortion(Integer abortion) {
        this.abortion = abortion;
    }

    public Integer getLiving() {
        return living;
    }

    public void setLiving(Integer living) {
        this.living = living;
    }

    public Date getLMP() {
        return LMP;
    }

    public void setLMP(Date LMP) {
        this.LMP = LMP;
    }

    public Date getEDC() {
        return EDC;
    }

    public void setEDC(Date EDC) {
        this.EDC = EDC;
    }

    public Date getITDate() {
        return ITDate;
    }

    public void setITDate(Date ITDate) {
        this.ITDate = ITDate;
    }

    public Date getMenarche() {
        return menarche;
    }

    public void setMenarche(Date menarche) {
        this.menarche = menarche;
    }
}

