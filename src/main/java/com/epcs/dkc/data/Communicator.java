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
    @Autowired
    private CategoriesRepository categoriesRepository;
    @Autowired
    private ModifiersRepository modifiersRepository;
    @Autowired
    private SizesRepository sizesRepository;

    /* ------------ Consumables ------------ */
    public String addConsumable(String name, String description, double price, int modifier_id, int size_id) {
        Consumables consumable = new Consumables();
        consumable.setName(name);
        consumable.setDescription(description);
        consumable.setPrice(price);
        consumable.setModifier_id(modifier_id);
        consumable.setSize_id(size_id);

        consumablesRepository.save(consumable);
        return "Consumable Saved";
    }

    /* ------------ Categories ------------ */
    public String addCategory(String name) {
        Categories category = new Categories();
        category.setName(name);

        categoriesRepository.save(category);
        return "Category Saved";
    }

    /* ------------ Modifiers ------------ */

    /* ------------ Sizes ------------ */


    public Iterable<Consumables> getAllConsumables() {
        return consumablesRepository.findAll();
    }
}
