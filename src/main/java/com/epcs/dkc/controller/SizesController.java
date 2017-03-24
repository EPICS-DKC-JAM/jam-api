package com.epcs.dkc.controller;

import com.epcs.dkc.data.Categories;
import com.epcs.dkc.data.Communicator;
import com.epcs.dkc.data.Sizes;
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
@RequestMapping("/sizes")
public class SizesController {

    @Autowired
    private Communicator dataCommunicator;

    @GetMapping(path="/add")
    public @ResponseBody
    String addNewSize(@RequestParam String name, @RequestParam int consumable_id) {
        return dataCommunicator.addSize(name, consumable_id);
    }

    @GetMapping(path="/all")
    public @ResponseBody
    Iterable<Sizes> getAllSizes() {
        return dataCommunicator.getAllSizes();
    }
}
