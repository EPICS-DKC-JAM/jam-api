package com.epcs.dkc.controller;

import com.epcs.dkc.data.Categories;
import com.epcs.dkc.data.Communicator;
import com.epcs.dkc.data.Categories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/**
 * Created by shai on 3/24/17.
 */
@Controller
@RequestMapping("/categories")
public class CategoriesController {

    @Autowired
    private Communicator dataCommunicator;

    @GetMapping(path="/add")
    public @ResponseBody String addNewCategory(@RequestParam String name) {
        return dataCommunicator.addCategory(name);
    }

    @GetMapping(path="/getByName")
    public @ResponseBody Categories getByName(@RequestParam String name) {
        return dataCommunicator.getCategoryByName(name);
    }

    @GetMapping(path="/getById")
    public @ResponseBody Categories getById(@RequestParam int id) {
        return dataCommunicator.getCategoryById(id);
    }

    @GetMapping(path="/update")
    public @ResponseBody String update(@ModelAttribute Categories category) {
        return dataCommunicator.updateCategory(category);
    }

    @GetMapping(path="/all")
    public @ResponseBody Iterable<Categories> getAllCategories() {
        return dataCommunicator.getAllCategories();
    }
}
