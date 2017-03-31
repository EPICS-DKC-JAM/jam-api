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

    public boolean doesConsumableExist(int id) {
        return consumablesRepository.findById(id) != null;
    }

    public Consumables getConsumableById(int id) {
        return consumablesRepository.findById(id);
    }

    public Consumables getConsumableByName(String name) {
        return consumablesRepository.findByName(name);
    }

    public String updateConsumable(Consumables consumable) {
        if (!doesConsumableExist(consumable.getId())) {
            return "Consumable does not exist!";
        }

        consumablesRepository.save(consumable);
        return "Consumable " + consumable.getName() + " updated.";
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

    public boolean doesCategoryExist(int id) {
        return categoriesRepository.findById(id) != null;
    }

    public Categories getCategoryById(int id) {
        return categoriesRepository.findById(id);
    }

    public Categories getCategoryByName(String name) {
        return categoriesRepository.findByName(name);
    }

    public String updateCategory(Categories category) {
        if (!doesCategoryExist(category.getId())) {
            return "Category does not exist!";
        }

        categoriesRepository.save(category);
        return "Category " + category.getName() + " updated.";
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

    public boolean doesModifierExist(int id) {
        return modifiersRepository.findById(id) != null;
    }

    public Modifiers getModifierById(int id) {
        return modifiersRepository.findById(id);
    }

    public Modifiers getModifierByName(String name) {
        return modifiersRepository.findByName(name);
    }

    public String updateModifier(Modifiers modifier) {
        if (!doesModifierExist(modifier.getId())) {
            return "Modifier does not exist!";
        }

        modifiersRepository.save(modifier);
        return "Modifier " + modifier.getName() + " updated.";
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

    public Sizes getSizeById(int id) {
        return sizesRepository.findById(id);
    }

    public Iterable<Sizes> getAllSizes() {
        return sizesRepository.findAll();
    }
}
