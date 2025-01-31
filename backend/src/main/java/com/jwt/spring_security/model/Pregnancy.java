package com.jwt.spring_security.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Pregnancy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pregnancy_id;

    @OneToOne
    @JoinColumn(name = "clientID", referencedColumnName = "clientID")
    @JsonBackReference
    private Patient patient;

    private Integer gravida;
    private Integer para;
    private Integer term;
    private Integer pre_term;
    private Integer abortion;
    private Integer living;
    private Date LMP;
    private Date EDC;
    private Date TT_date;
    private Date menarche;

    @Column(nullable = false)
    private boolean deleted = false;

    public Long getPregnancy_id() {
        return pregnancy_id;
    }

    public void setPregnancy_id(Long pregnancy_id) {
        this.pregnancy_id = pregnancy_id;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public int getGravida() {
        return gravida;
    }

    public void setGravida(Integer gravida) {
        this.gravida = gravida;
    }

    public int getPara() {
        return para;
    }

    public void setPara(Integer para) {
        this.para = para;
    }

    public int getTerm() {
        return term;
    }

    public void setTerm(Integer term) {
        this.term = term;
    }

    public int getPre_term() {
        return pre_term;
    }

    public void setPre_term(Integer pre_term) {
        this.pre_term = pre_term;
    }

    public int getAbortion() {
        return abortion;
    }

    public void setAbortion(Integer abortion) {
        this.abortion = abortion;
    }

    public int getLiving() {
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

    public Date getTT_date() {
        return TT_date;
    }

    public void setTT_date(Date TT_date) {
        this.TT_date = TT_date;
    }

    public Date getMenarche() {
        return menarche;
    }

    public void setMenarche(Date menarche) {
        this.menarche = menarche;
    }
}
