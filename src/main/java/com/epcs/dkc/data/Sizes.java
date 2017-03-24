package com.epcs.dkc.data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * Created by shane on 3/24/17.
 */
@Entity
public class Sizes {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private int consumable_id;
    private String name;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getConsumable_id() {
        return consumable_id;
    }

    public void setConsumable_id(int consumable_id) {
        this.consumable_id = consumable_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
