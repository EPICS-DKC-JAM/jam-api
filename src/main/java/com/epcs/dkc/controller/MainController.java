package com.epcs.dkc.controller;

import com.epcs.dkc.data.Communicator;
import com.epcs.dkc.data.Consumables;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by shane on 2/17/17.
 */

@Controller
@RequestMapping("/")
public class MainController {

    @Autowired
    private Communicator dataCommunicator;

    @GetMapping(path="/add")
    public @ResponseBody String addNewConsumable(@RequestParam String name, @RequestParam String description, @RequestParam double price,
                            @RequestParam int category_id, @RequestParam int modifier_id) {
        return dataCommunicator.addConsumable(name, description, price, category_id, modifier_id);
    }

    @GetMapping(path="/all")
    public @ResponseBody Iterable<Consumables> getAllConsumables() {
        return dataCommunicator.getAllConsumables();
    }
}
