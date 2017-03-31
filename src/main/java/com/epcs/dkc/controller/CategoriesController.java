package com.epcs.dkc.controller;

import com.epcs.dkc.data.Categories;
import com.epcs.dkc.data.Communicator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by shai on 3/24/17.
 */
@Controller
@RequestMapping("/categories")
public class CategoriesController {

    @Autowired
    private Communicator dataCommunicator;

    @GetMapping(path="/add")
    public @ResponseBody
    String addNewCategory(@RequestParam String name) {
        return dataCommunicator.addCategory(name);
    }

    @GetMapping(path="/all")
    public @ResponseBody
    Iterable<Categories> getAllCategories() {
        return dataCommunicator.getAllCategories();
    }
}
