package com.epcs.dkc.controller;

import com.epcs.dkc.data.Communicator;
import com.epcs.dkc.data.Modifiers;
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
@RequestMapping("/modifiers")
public class ModifiersController {

    @Autowired
    private Communicator dataCommunicator;

    @GetMapping(path="/add")
    public @ResponseBody
    String addNewModifier(@RequestParam String name, @RequestParam String type, @RequestParam String description) {
        return dataCommunicator.addModifier(name, type, description);
    }

    @GetMapping(path="/all")
    public @ResponseBody
    Iterable<Modifiers> getAllModifiers() {
        return dataCommunicator.getAllModifiers();
    }
}