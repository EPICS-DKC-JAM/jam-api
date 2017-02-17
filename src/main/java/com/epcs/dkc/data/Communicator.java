package com.epcs.dkc.data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

/**
 * Created by shane on 2/17/17.
 */

@Controller
public class Communicator {

    @Autowired
    private ConsumablesRepository consumablesRepository;

    public String addConsumable(String name, String description, double price, int category_id, int modifier_id, int size_id) {
        Consumables consumable = new Consumables();
        consumable.setName(name);
        consumable.setDescription(description);
        consumable.setPrice(price);
        consumable.setCategory_id(category_id);
        consumable.setModifier_id(modifier_id);
        consumable.setSize_id(size_id);

        consumablesRepository.save(consumable);
        return "Saved";
    }

    public Iterable<Consumables> getAllConsumables() {
        return consumablesRepository.findAll();
    }
}
