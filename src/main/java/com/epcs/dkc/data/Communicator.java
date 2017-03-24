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

    public Iterable<Consumables> getAllConsumables() {
        return consumablesRepository.findAll();
    }

    /* ------------ Categories ------------ */
    public String addCategory(String name) {
        Categories category = new Categories();
        category.setName(name);

        categoriesRepository.save(category);
        return "Category Saved";
    }

    public Iterable<Categories> getAllCategories() {
        return categoriesRepository.findAll();
    }

    /* ------------ Modifiers ------------ */
    public String addModifier(String name, String type, String description) {
        Modifiers modifier = new Modifiers();
        modifier.setName(name);
        modifier.setType(type);
        modifier.setDescription(description);

        modifiersRepository.save(modifier);
        return "Modifier Saved";
    }

    public Iterable<Modifiers> getAllModifiers() {
        return modifiersRepository.findAll();
    }

    /* ------------ Sizes ------------ */

    public String addSize(String name, int consumableId) {
        Sizes size = new Sizes();
        size.setName(name);
        size.setConsumable_id(consumableId);

        sizesRepository.save(size);
        return "Size Saved";
    }

    public Iterable<Sizes> getAllSizes() {
        return sizesRepository.findAll();
    }
}
